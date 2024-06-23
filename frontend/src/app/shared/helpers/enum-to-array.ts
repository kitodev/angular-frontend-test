export const arrayFromObject = (object: object) =>
  Object.entries(object)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([key, value]) => ({ key, value }));
