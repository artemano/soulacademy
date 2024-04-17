import { auth } from "@/auth";
import { ServiceFactory } from "@/lib/service.factory";
import { AttachmentService, CourseService } from "@/services/courses";
//import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.username;
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    const coursesService = ServiceFactory.getInstance(
      "Courses"
    ) as CourseService;
    const courseOwner = await coursesService.findByUser(
      params.courseId,
      userId
    );
    if (!courseOwner) {
      return new NextResponse("No encontrado", { status: 502 });
    }
    const attachmentService = ServiceFactory.getInstance(
      "Attachments"
    ) as AttachmentService;
    const attachment = attachmentService.create(url, params.courseId);
    if (attachment) {
      return NextResponse.json(attachment);
    }
    return new NextResponse("Error Interno de Servidor", { status: 500 });
  } catch (error) {
    console.log("[COUSE_ID_ATTACHMENTS", error);
    return new NextResponse("Error Interno de Servidor", { status: 500 });
  }
}
