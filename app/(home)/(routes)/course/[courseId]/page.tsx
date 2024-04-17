import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Chapter, Course } from "@prisma/client";
import ExpandableCard from "@/components/expandable-card";
import { Button } from "@/components/ui/button";
import { BsPlayCircle } from "react-icons/bs";
import { CourseOptions as options } from "@/app/utils/model";
import { formatLocaleDate } from '@/app/lib/utils';
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { TipTap } from "@/components/tip-tap";

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
    params
}: {
    params: { courseId: string; }
}) {
    const getCourseOption = (search: string) => {
        const value = options.find(opt => opt.value === search);
        console.log(value);
        return value?.label;
    }

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
            <div className="w-full h-[20px] text-muted-foreground px-4 text-sm my-2">
                <Link href="/">◀ <span className=" hover:underline font-semibold">Volver</span></Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="xl:mx-auto lg:py-10 w-full px-5 lg:pl-14 text-gray-800 lg:col-span-7 sm:max-w-[832px] lg:max-w-[1024px] lg:w-full">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white" >{course.title}</h1>
                    <Separator />
                    <div className="p-2 w-full text-justify my-2 text-gray-600">
                        {course.description}
                    </div>
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Modalidad</h3>
                        <Separator />
                        <div className="text-sm py-2">
                            {getCourseOption(course.modality)}
                        </div>
                    </div>
                    {(course.modality === "ONLINE" || course.modality === "MASTERCLASS") && (
                        <div className="p-2 w-full text-justify my-2">
                            <h3 className="text-left font-bold text-xl pb-1">Fechas</h3>
                            <Separator />
                            <div className="text-sm py-2">
                                <h4><span className="font-semibold text-base">Inicia:</span> {formatLocaleDate(course.startDate!)}</h4>
                                <h4><span className="font-semibold text-base">Termina:</span> {formatLocaleDate(course.endDate!)}</h4>
                            </div>
                        </div>
                    )
                    }
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Para quién?</h3>
                        <Separator />
                        <div className="mt-1 mb-0">
                            <TipTap value={course.detail?.target!} readonly className="h-full" />
                        </div>
                    </div>
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Para qué?</h3>
                        <Separator />
                        <div className="mt-1 mb-0">
                            <TipTap value={course.detail?.goal!} readonly className="h-full" />
                        </div>
                    </div>
                    <div className="p-2 w-full text-justify my-2">
                        <h3 className="text-left font-bold text-xl pb-1">Qué vas a aprender?</h3>
                        <Separator />
                        <div className="mt-1 mb-0">
                            <TipTap value={course.detail?.teachings!} readonly className="h-full" />
                        </div>
                    </div>


                </div>
                <div className="px-5 sm:px-5 py-5 sm:py-10 w-full lg:col-span-5 order-first lg:order-last xl:max-w-[550px]">
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
                    <div className="p-2 w-full text-justify my-3">
                        <h3 className="text-left font-bold text-xl pb-1">Temario</h3>
                        <Separator />
                        <div className="my-3">
                            {course.chapters.map((chapter: Chapter) => {
                                return (
                                    <ExpandableCard key={chapter.id} title={chapter.title} content={chapter.summary!} />
                                )
                            })}
                        </div>
                    </div>
                    <div className="w-full text-justify my-3 rounded-lg bg-emerald-100 p-5">
                        <h3 className="text-left font-bold text-xl pb-1">Bonos</h3>
                        <Separator />
                        <div className="mt-1 mb-0">
                            <TipTap value={course.detail?.bonus!} readonly className="h-full" />
                        </div>
                    </div>
                    <div className="p-5 w-full text-justify my-3 bg-rose-100 rounded-lg">
                        <h3 className="text-left font-bold text-xl pb-1">Garantía</h3>
                        <Separator />
                        <div className="mt-1 mb-0">
                            <TipTap value={course.detail?.warranty!} readonly className="h-full" />
                        </div>
                    </div>

                </div>

            </div>
        </div >
    )
}
