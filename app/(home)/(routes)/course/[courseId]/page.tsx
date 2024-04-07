import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Chapter } from "@prisma/client";
import { Preview } from "@/components/preview";
import ExpandableCard from "@/components/expandable-card";
import { Button } from "@/components/ui/button";
import { BsPlayCircle } from "react-icons/bs";
import { formatPrice } from '../../../../../lib/format';



const CourseDetailPage = async ({
    params
}: {
    params: { courseId: string; }
}) => {
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc"
                }
            },
            detail: true,
        }
    });
    console.log(course);
    if (!course) {
        return redirect("/");
    }

    const accessLink = `/courses/${course.id}/chapters/${course.chapters[0].id}`;

    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="mx-auto py-5 md:py-10 w-full px-5 lg:pl-14 text-gray-800 lg:col-span-7 sm:max-w-[600px] lg:w-full">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white" >{course.title}</h1>
                    <Separator />
                    <div className="p-2 w-full text-justify my-2 text-gray-600">
                        {course.description}
                    </div>
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Modalidad</h3>
                        <Separator />
                        <div className="text-sm py-2">
                            {course.modality}
                        </div>
                    </div>
                    {(course.modality === "ONLINE" || course.modality === "MASTERCLASS") && (
                        <div className="p-2 w-full text-justify my-2">
                            <h3 className="text-left font-bold text-xl pb-1">Fechas</h3>
                            <Separator />
                            <div className="text-sm py-2">
                                <h4><span className="font-semibold text-base">Inicia:</span> {course.startDate?.toDateString()}</h4>
                                <h4><span className="font-semibold text-base">Termina:</span> {course.endDate?.toDateString()}</h4>
                            </div>
                        </div>
                    )
                    }

                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Qué vas a aprender?</h3>
                        <Separator />
                        <div className="my-3">

                            {course.chapters.map((chapter: Chapter) => {
                                return (
                                    <ExpandableCard key={chapter.id} title={chapter.title} content={chapter.summary!} />
                                )
                            })}
                        </div>
                    </div>
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Para quién?</h3>
                        <Separator />
                    </div>

                </div>
                <div className="px-5 sm:px-5 py-5 sm:py-10 w-full lg:col-span-5 order-first lg:order-last">
                    <div className="relative mx-auto bg-black rounded-xl aspect-video sm:max-w-[600px] lg:max-w-[360px]">
                        <Image
                            src={course.imageUrl!}
                            fill
                            alt={course.title}
                            className="object-contain w-full rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/40 flex-col gap-y-2 text-secondary">
                            <BsPlayCircle className="h-12 w-12 cursor-pointer" />
                            <p className="absolute text-sm bottom-2">
                                Vista Previa
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto w-full flex flex-col items-center pt-10 justify-center sm:max-w-[600px] lg:max-w-[360px]">
                        {course.discountPrice ? (
                            <div className="px-2 w-full flex flex-col items-start justify-center">
                                <div className="py-1 text-[20px] font-semibold text-gray-400 line-through  ">{formatPrice(course.price!)}</div>
                                <div className="pb-4 text-[32px] font-semibold text-gray-900">{formatPrice(course.discountPrice!)}</div>
                            </div>
                        ) : (
                            <div className="flex flex-row items-end justify-start">
                                <div className="py-2 text-[32px] font-semibold text-gray-900 mr-2">{formatPrice(course.price!)} COP</div>
                            </div>
                        )
                        }
                        <Button variant="success" className="w-full sm:max-w-[600px] bg-violet-700 text-md font-semibold">Comprar</Button>
                    </div>

                </div>

            </div>
        </div >
    )
}

export default CourseDetailPage;