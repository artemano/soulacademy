import { db } from "@/lib/db";
import { ServiceFactory } from "@/lib/service.factory";
import { UserProgressService } from "@/services/courses";

export const getProgress = async (
    userId: string,
    courseId: string,
): Promise<number> => {
    try {
        // Get the percentage of  completed modules for a specific course.
        const progressService = ServiceFactory.getInstance("UserProgress") as UserProgressService;
        const progressPercentage = await progressService.findCompletedByUser(userId, courseId);
        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
}