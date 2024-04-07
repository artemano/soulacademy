import { ServiceFactory } from "@/lib/service.factory";
import { ChapterService } from "@/services/courses";
//import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import IconBadge from "@/components/icon-badge";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import { auth } from "@/actions/auth";
import ChapterSummaryForm from "./_components/chapter-summary-form";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { courseId, chapterId } = params;
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const chapterService = ServiceFactory.getInstance(
        "Chapters"
    ) as ChapterService;

    const chapter = await chapterService.findById(chapterId, courseId);
    if (!chapter) {
        return redirect("/");
    }

    const requireFields = [chapter.title, chapter.description, chapter.videoUrl];
    const totalFields = requireFields.length;
    const completeFields = requireFields.filter(Boolean).length;
    const completionText = `(${completeFields}/${totalFields})`;
    const isComplete = requireFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="Este capítulo no ha sido publicado aún. No estará visible en el curso hasta su publicación."
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retornar a la configuración del curso
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Creación de Capítulo</h1>
                                <span className="text-sm text-slate-700">
                                    Completa todos los campos {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">Personaliza tu capítulo</h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <ChapterSummaryForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Configuración de Acceso</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">Agregar un video</h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;
