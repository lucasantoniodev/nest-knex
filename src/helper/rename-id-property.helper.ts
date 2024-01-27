export const renameIdProperty = <T>(
  records: T | T[],
  newPropertyName: string,
) => {
  const processRecord = (record: T | T[]) => {
    record[newPropertyName] = record['id'];
    delete record['id'];
  };

  if (Array.isArray(records)) {
    records.forEach(processRecord);
    return;
  }

  processRecord(records);
};
