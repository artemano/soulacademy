import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService, MuxService } from "@/services/courses";
//import { auth } from "@clerk/nextjs/server";
import { auth } from "@/actions/auth";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const ownCourse = await courseService.findById(courseId, userId);
        console.log(ownCourse);

        if (!ownCourse) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const chapter = await chapterService.findById(chapterId, courseId);

        const muxService = ServiceFactory.getInstance("MuxData") as MuxService;
        const muxData = await muxService.findFirst(chapterId);

        if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl || !muxData) {
            return new NextResponse("Campos requeridos faltantes", { status: 400 });
        }

        const publisedChapter = await chapterService.patch(chapterId, courseId, { id: chapterId, courseId: courseId, isPublished: true });
        if (publisedChapter) {
            return NextResponse.json(publisedChapter);
        }
        throw Error("Error al publicar");
    } catch (error) {
        console.error("[CHAPTER_PUBLISH]", error);
        return new NextResponse(`Error Interno: ${error}`, { status: 500 });
    }
}