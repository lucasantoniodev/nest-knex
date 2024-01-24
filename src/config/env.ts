const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_CLIENT,
  DATABASE_POOL_MIN,
  DATABASE_POOL_MAX,
} = process.env;

export const env = {
  databaseHost: String(DATABASE_HOST),
  databasePort: Number(DATABASE_PORT),
  databaseName: String(DATABASE_NAME),
  databaseUser: String(DATABASE_USER),
  databasePassword: String(DATABASE_PASSWORD),
  databaseClient: String(DATABASE_CLIENT),
  databasePoolMin: Number(DATABASE_POOL_MIN),
  databasePoolMax: Number(DATABASE_POOL_MAX),
};
