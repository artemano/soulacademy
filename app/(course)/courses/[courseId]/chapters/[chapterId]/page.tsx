//import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";
import { getChapter } from "@/actions/get-chapter";
import { auth } from "@/actions/auth";
import { TipTap } from "@/components/tip-tap";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    });

    if (!chapter || !course) {
        return redirect("/")
    }


    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner
                    variant="success"
                    label="Ya has completado este capítulo."
                />
            )}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="Debes comprar este curso para acceder a este capítulo."
                />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        chapterId={params.chapterId}
                        title={chapter.title}
                        courseId={params.courseId}
                        nextChapterId={nextChapter?.id}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {purchase ? (
                            <CourseProgressButton
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                                nextChapterId={nextChapter?.id}
                                isCompleted={!!userProgress?.isCompleted}
                            />
                        ) : (
                            <CourseEnrollButton
                                courseId={params.courseId}
                                price={course.price!}
                            />
                        )}
                    </div>
                    <Separator />
                    {!isLocked && (
                        <>
                            <div>
                                <TipTap value={chapter.description!} readonly />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mt-3 mb-2 p-4">
                                    Anexos
                                </h2>
                                <Separator />
                                {!!attachments.length && (
                                    <div className="p-4">
                                        {attachments.map((attachment) => (
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                key={attachment.id}
                                                className="flex items-center p-3 w-full bg-purple-200 border text-purple-700 rounded-md hover:underline"
                                            >
                                                <File />
                                                <p className="line-clamp-1">
                                                    {attachment.name}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )
                    }
                </div>
            </div>
        </div>
    );
}
export const dynamic = 'force-dynamic';
export default ChapterIdPage;