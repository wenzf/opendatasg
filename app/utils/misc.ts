
export function removeTrailingSlash(str: string): string {
  return str.endsWith("/") ? str.slice(0, -1) : str;
}


export const getLabelById = (dict: Record<string, string>, id: string | number) => {
  if (!id) return id
  const _id = id?.toString()
  try {
    if (dict[_id]) return dict[_id]
  } catch {
    return id
  }
}