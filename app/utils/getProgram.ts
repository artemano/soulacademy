import { fetchAPI } from "./fetch-api";

export default async function getProgramBySlug(slug: string) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/course-categories`;

    const urlParamsObject: any = {
      filters: { slug: slug },
      populate: {
        courses: { populate: "*" },
        cover: { fields: ["url"] },
        poster: { fields: ["url"] },
        welcome: { fields: ["url"] },
        images: {
          fields: ["url", "alternativeText", "caption", "width", "height"],
        },
      },
      pagination: {
        start: 0,
        limit: 1,
      },
    };

    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    //console.log(responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve program data: ${error}`);
  }
}
