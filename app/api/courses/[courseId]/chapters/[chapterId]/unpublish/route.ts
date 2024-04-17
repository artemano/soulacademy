import { auth } from "@/auth";
import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService, MuxService } from "@/services/courses";
//import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const session = await auth();
        const userId = session?.user.username;

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const { courseId, chapterId } = params;
        // Let's check if the user owns the course provided

        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const ownCourse = await courseService.findById(courseId, userId);

        if (!ownCourse) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const unPublishChapter = await chapterService.patch(chapterId, courseId, { id: chapterId, courseId: courseId, isPublished: false });
        const publishedChaptersInCourse = await chapterService.findByCourse(courseId, true);

        if (!publishedChaptersInCourse?.length) {
            const courseService = ServiceFactory.getInstance("Courses") as CourseService;
            await courseService.update(userId, courseId, { id: courseId, userId: userId, isPublished: false });
        }

        return NextResponse.json(unPublishChapter);
    } catch (error) {
        console.error("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse(`Error Interno: ${error}`, { status: 500 });
    }
}