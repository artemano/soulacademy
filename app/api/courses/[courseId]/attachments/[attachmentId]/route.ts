import { auth } from "@/actions/auth";
import { ServiceFactory } from "@/lib/service.factory";
import { AttachmentService, CourseService } from "@/services/courses";
//import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
export const utapi = new UTApi();

export async function DELETE(
  req: Request,
  { params }: { params: { attachmentId: string; courseId: string } }
) {
  try {
    const { userId } = await auth();
    // Verifica si el usuario está autenticado
    if (!userId) {
      return new NextResponse("No autorizado", { status: 401 });
    }
    // Verifica si el usuario es el dueño del curso
    const coursesService = ServiceFactory.getInstance(
      "Courses"
    ) as CourseService;

    const courseOwner = await coursesService.findByUser(
      params.courseId,
      userId
    );

    if (!courseOwner) {
      return new NextResponse("Usuario no autorizado", { status: 401 });
    }
    // Borra el anexo
    const attachmentService = ServiceFactory.getInstance(
      "Attachments"
    ) as AttachmentService;

    const removeAttachedFile = await attachmentService.findById(
      params.attachmentId
    );

    const attachment = await attachmentService.delete(
      params.attachmentId,
      params.courseId
    );

    if (removeAttachedFile) {
      await utapi.deleteFiles(removeAttachedFile.name);
    }
    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Error Interno de Servidor", { status: 500 });
  }
}
