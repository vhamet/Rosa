export const isSSR = () => typeof window === "undefined";

export const isEventOver = (start, end) => {
  if (!start && !end) return false;
  if (end) return end < Date.now();

  return start < Date.now();
};
