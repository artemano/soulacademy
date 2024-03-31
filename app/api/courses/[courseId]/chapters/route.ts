import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService } from "@/services/courses";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const { title } = await req.json();
        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }
        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const courseOwner = await courseService.findById(params.courseId, userId);
        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const lastChapter = await chapterService.findFirst(params.courseId);
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await chapterService.create(title, params.courseId, newPosition);
        if (chapter) {
            return NextResponse.json(chapter);
        }
        return new NextResponse("Error Interno de Servidor", { status: 500 });
    } catch (error) {
        console.error("[CHAPTERS]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}