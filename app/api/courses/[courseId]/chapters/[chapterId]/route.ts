import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService, CourseService, MuxService } from "@/services/courses";
//import { auth } from "@clerk/nextjs";
import { auth } from "@/actions/auth";

import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux();
export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
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
        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const chapter = await chapterService.findById(params.chapterId, params.courseId);

        if (!chapter) {
            return new NextResponse("No encontrado", { status: 404 });
        }

        if (chapter.videoUrl) {
            const muxService = ServiceFactory.getInstance("MuxData") as MuxService;
            const existingMuxData = await muxService.findFirst(params.chapterId);
            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await muxService.delete(existingMuxData.id)
            }
        }
        const deletedChapter = await chapterService.delete(params.chapterId);
        const publishedChaptersInCourse = await chapterService.findPublisedByCourseId(params.courseId, true);
        if (!publishedChaptersInCourse?.length) {
            await courseService.update(userId, params.courseId, { id: params.courseId, userId: userId, isPublished: false })
        }
        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error("[COURSES_CHAPTER_ID_DELETE]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }

}
export async function PATCH(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("No autorizado", { status: 401 });
        }

        const { isPublished, ...values } = await req.json();
        const courseService = ServiceFactory.getInstance("Courses") as CourseService;
        const ownCourse = await courseService.findById(params.courseId, userId);

        if (!ownCourse) {
            return new NextResponse("No autorizado", { status: 401 });
        }
        console.log(values);
        const chapterService = ServiceFactory.getInstance("Chapters") as ChapterService;
        const chapter = await chapterService.patch(params.chapterId, params.courseId, values);
        console.log(chapter);
        if (!chapter) {
            throw Error("Error al actualizar el capítulo");
        }
        if (values.videoUrl) {
            const muxService = ServiceFactory.getInstance("MuxData") as MuxService;
            const existingMuxData = await muxService.findFirst(params.chapterId);
            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await muxService.delete(existingMuxData.id)
            }
            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ['public'],
                test: false
            });
            await muxService.create(params.chapterId, asset.id, asset.playback_ids?.[0]?.id);
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Error Interno", { status: 500 });
    }
}