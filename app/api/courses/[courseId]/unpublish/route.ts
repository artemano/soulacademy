import { ServiceFactory } from "@/lib/service.factory";
import { CourseService } from "@/services/courses";
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
        const course = await courseService.findByIdLazy(courseId, userId);
        if (!course) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const unpublishedCourse = await courseService.publishAction(userId, courseId, false);

        if (unpublishedCourse) {
            return NextResponse.json(unpublishedCourse);
        }
        throw Error("Error al publicar");
    } catch (error) {
        console.error("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse(`Error Interno: ${error}`, { status: 500 });
    }
}