export function getStrapiURL(path = "") {
  //console.log("GETSTRAPI", path, process.env.LOCAL_STRAPI_API_URL, );
  const resutl = process.env.LOCAL_STRAPI_API_URL !== undefined ? `${process.env.LOCAL_STRAPI_API_URL}${path}` : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.coachrafapino.online'}${path}`;
  //console.log(resutl);
  return resutl;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) {
    return null;
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "numeric",
    hourCycle: "h12",
  };
  return date.toLocaleDateString("es-CO", options);
}

// ADDS DELAY TO SIMULATE SLOW API REMOVE FOR PRODUCTION
export const delay = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(1), time));
