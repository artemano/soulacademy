import { ServiceFactory } from "@/lib/service.factory";
import { CourseService, CourseWithProgressWithCategory, GetCourses } from "@/services/courses";


export const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const coursesService = ServiceFactory.getInstance("Courses") as CourseService;
        const findCourses = await coursesService.searchCourses(userId, title, categoryId);
        return findCourses;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}
