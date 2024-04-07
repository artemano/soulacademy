import { fetchAPI } from "./fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
  //console.log("getPageBySlug: SLUG:---------------------------------", slug);
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/pages`;
    const urlParamsObject = { filters: { slug }, locale: lang };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const page = await fetchAPI(path, urlParamsObject, options);
    return page;
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve page data: ${error}`);
  }
}
