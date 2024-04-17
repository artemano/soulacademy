import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { auth } from "@/actions/auth";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

interface CoursesListProps {
    items: CourseWithProgressWithCategory[];
}

export const CoursesList = async ({
    items
}: CoursesListProps) => {


    return (
        <div className="mt-5">
            <div className="flex items-center justify-center">
                {items.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-10">
                        No se encontraron cursos...
                    </div>
                )}
                <div className="flex flex-wrap justify-center items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => {
                        return (
                            <CourseCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                imageUrl={item.imageUrl!}
                                chaptersLength={item.chapters.length}
                                price={item.price!}
                                progress={item.progress}
                                category={item?.category?.name!}
                            />)
                    })}
                </div>

            </div>
        </div>
    )
}