import { fetchAPI } from "./fetch-api";

export default async function getLatestCourses(
  onlyActives?: boolean,
  pageSize?: number
) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/course-categories`;

    const urlParamsObject: any = {
      sort: { isActive: "desc", starts: "asc" },
      filters: { isActive: onlyActives },
      populate: {
        courses: { populate: "*" },
      },
      pagination: {
        start: 0,
        limit: pageSize ?? 10,
      },
    };
    if (onlyActives == undefined) delete urlParamsObject.filters;

    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    return responseData;
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve latest courses: ${error}`);
  }
}
