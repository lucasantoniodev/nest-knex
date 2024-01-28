export const hasValidData = <T>(entity: T): boolean => {
  return Object.values(entity).some((value) => value !== undefined);
};
