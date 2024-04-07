import { UpdateCourseDto } from "@/lib/dtos/courses";
import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService, MuxService } from "@/services/courses";
// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { auth } from "@/actions/auth";

const mux = new Mux();

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const courseService = ServiceFactory.getInstance("Courses") as CourseService;
    const ownCourse = await courseService.findById(params.courseId, userId);

    if (!ownCourse) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const muxService = ServiceFactory.getInstance("MuxData") as MuxService;
    for (const chapter of ownCourse.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData?.assetId);
        await muxService.delete(chapter.muxData?.id!);
      }
    }
    const deletedCourse = await courseService.delete(params.courseId);

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE__DELETE]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }

}

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();
    const courseId = params.courseId;
    if (!userId) {
      return new NextResponse("Usuario no autorizado.", { status: 401 });
    }
    if (!courseId) {
      return new NextResponse("Error en petición.", { status: 400 });
    }

    const courseDto = (await req.json()) as UpdateCourseDto;

    const courseService = ServiceFactory.getInstance("Courses") as CourseService;
    const course = await courseService.update(userId, courseId, courseDto);
    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


