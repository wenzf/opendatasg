
export function removeTrailingSlash(str: string): string {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}


export const getLabelById = (dict: Record<string, string>, id: string | number) => {
  const _id = id.toString()
  if (dict[_id]) return dict[_id]
  return id
}