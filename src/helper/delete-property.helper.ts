export const deleteProperty = <T>(data: T, propertyName: string) => {
  delete data[propertyName];
};
