import { fetchAPI } from "./fetch-api";

export default async function getCourseById(courseId: string) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/courses`;

    const urlParamsObject: any = {
      filters: { courseId: courseId },
      populate: {
        cover: { fields: ["url"] },
        course_category: { populate: "*" },
        chapters: { populate: "*" },
        colors: { populate: "*" },
      },
      pagination: {
        start: 0,
        limit: 1,
      },
    };

    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    return responseData;
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve course data: ${error}`);
  }
}
