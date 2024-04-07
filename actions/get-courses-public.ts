import { ServiceFactory } from "@/lib/service.factory";
import { CourseService, CourseWithProgressWithCategory, GetCoursesPublic } from "@/services/courses";
import { Course } from "@prisma/client";


export const getCoursesPublic = async ({
    title,
    categoryId
}: GetCoursesPublic): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const coursesService = ServiceFactory.getInstance("Courses") as CourseService;
        const findCourses = await coursesService.publicSearch(title, categoryId);
        return findCourses;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}
