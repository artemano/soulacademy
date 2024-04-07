import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService, MuxService } from "@/services/courses";
import { auth } from "@/actions/auth";
//import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const { courseId } = params;

        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const course = await courseService.findById(courseId, userId);
        if (!course) {
            return new NextResponse("No autorizado", { status: 401 });
        }
        const hasPublishedChapter = course?.chapters?.some((chapter) => chapter.isPublished);

        if (!course || !course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
            return new NextResponse("Algunos campos requeridos no han sido diligenciados", { status: 401 });
        }
        const publishedCourse = await courseService.publishAction(userId, courseId, true);

        if (publishedCourse) {
            return NextResponse.json(publishedCourse);
        }
        throw Error("Error al publicar");
    } catch (error) {
        console.error("[COURSE_ID_PUBLISH]", error);
        return new NextResponse(`Error Interno: ${error}`, { status: 500 });
    }
}