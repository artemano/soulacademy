import { auth } from "@/auth";
import { UpdateCourseDetailsDto } from "@/lib/dtos/courses";
import { ServiceFactory } from "@/lib/service.factory";
import { CourseService } from "@/services/courses";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const session = await auth();
        const userId = session?.user.username;
        const courseId = params.courseId;
        if (!userId) {
            return new NextResponse("Usuario no autorizado.", { status: 401 });
        }
        if (!courseId) {
            return new NextResponse("Error en petición.", { status: 400 });
        }

        const courseDto = (await req.json()) as UpdateCourseDetailsDto;

        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const isOwner = await courseService.findByIdLazy(courseId, userId);
        if (isOwner) {
            console.log(isOwner)
            const course = await courseService.updateDetails(courseId, courseDto);
            return NextResponse.json(course);
        }
        return new NextResponse("Usuario no autorizado.", { status: 401 });
    } catch (error) {
        console.log("[COURSE_DETAILS_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}