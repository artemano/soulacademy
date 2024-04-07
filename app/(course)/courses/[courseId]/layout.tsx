import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
//import { auth } from "@clerk/nextjs";
import { auth } from "@/actions/auth";

const CourseLayout = async ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { courseId: string };
}) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/login")
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
                include: {
                    userProgress: {
                        where: {
                            userId,
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            },
        },
    });

    if (!course) {
        return redirect("/");
    }

    const progressCount = await getProgress(userId, course.id);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="h-[80px] fixed inset-y-0 w-full z-50">
                <CourseNavbar
                    course={course}
                    progressCount={progressCount}
                />
            </div>
            <div className="h-full">
                <div className="hidden md:flex h-full w-80 pt-[80px] flex-col fixed inset-y-0 z-50">
                    <CourseSidebar
                        course={course}
                        progressCount={progressCount}
                    />
                </div>
                <main className="md:pl-80 pt-[80px] h-full">
                    {children}
                </main>
            </div>
        </div>

    )
}

export default CourseLayout