// Replaces ‘ ‘ with ‘%20’
export const URLify = (string: string) => {
  return string.trim().replace(/\s/g, "%20");
};
