import { fetchAPI } from "./fetch-api";

export default async function getUserPurchases(username: string) {
  try {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const path = `/purchases`;
    const urlParamsObject: any = {
      filters: { userId: username },
      pagination: {
        start: 0,
        limit: 50,
      },
    };
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const responseData = await fetchAPI(path, urlParamsObject, options);
    if (responseData.data.length === 0) {
      return null;
    } else {
      let courses: any[] = [];
      let programs: any[] = [];
      responseData.data.map((item: any) => {
        const category = item.attributes.category;
        const element = {
          paymentRef: item.attributes.paymentRef,
          expiresOn: item.attributes.expiresOn,
          category: item.attributes.category,
          productId: item.attributes.productId,
          purchaseDate: item.attributes.purchaseDate,
        };
        if (category === "program") {
          programs.push(element);
        }
        if (category === "course") {
          courses.push(element);
        }
      });
      return {
        programs: programs.length > 0 ? programs : [],
        courses: courses.length > 0 ? courses : [],
      };
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve user's purchases: ${error}`);
  }
}
