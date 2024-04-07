import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService } from "@/services/courses";
//import { auth } from "@clerk/nextjs/server";
import { auth } from "@/actions/auth";

import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }
        const { list } = await req.json();
        console.log(list);
        // Let's check if the user owns the course provided
        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const ownCourse = await courseService.findById(params.courseId, userId);

        if (!ownCourse) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const res = await chapterService.reorder(list);
        if (res) {
            return new NextResponse("Success", { status: 200 });
        }
        throw Error("Error al reordenar los capítulos");
    } catch (error) {
        console.error("[REORDER]", error);
        return new NextResponse(`Error Interno: ${error}`, { status: 500 });
    }
}