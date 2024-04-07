// Converts a simple Object in a querystring
export function toQueryString(
  obj: Record<string, string | number | boolean>
): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}

export function parseUrl(href: string) {
  var match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      href: href,
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

export function getQueryParamsFromURL(url: string): { [key: string]: string } {
  let params: { [key: string]: string } = {};
  if (!url) return params;

  const searchParams = new URL(url).searchParams;

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}
