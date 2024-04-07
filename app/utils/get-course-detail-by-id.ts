import getCourseById from "./get-course-by-id";
import { Course } from "./model";

export async function getCourseDetailById(id: string) {
  try {
    const courseData = await getCourseById(id);
    const course = courseData.data[0] as Course;
    const courseId = course.attributes.courseId;
    const name = course.attributes.title;
    const programStartDate = course.attributes.starts!;
    return {
      id: courseId,
      name,
      startsOn: programStartDate,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve course details: ${error}`);
  }
}
