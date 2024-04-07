import { fetchAPI } from "./fetch-api";

export async function getPageByParent(
  parent: string,
  slug: string,
  lang: string
) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/page-configs`;
    const urlParamsObject = { filters: { slug, parent }, locale: lang };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const page = await fetchAPI(path, urlParamsObject, options);
    //console.log(page);
    return page;
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve paget config data: ${error}`);
  }
}
