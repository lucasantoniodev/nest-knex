import knex, { Knex } from 'knex';
import { disconnect, env } from 'process';

interface ConnectProps {
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  databaseUser: string;
  databasePassword: string;
  databaseClient: string;
  databasePoolMin: number;
  databasePoolMax: number;
}

export const postgresHelper = {
  client: null as unknown as Knex,
  databaseHost: null as unknown as string,
  databasePort: null as unknown as number,
  databaseName: null as unknown as string,
  databaseUser: null as unknown as string,
  databasePassword: null as unknown as string,
  databaseClient: null as unknown as string,
  databasePoolMin: null as unknown as number,
  databasePoolMax: null as unknown as number,

  async connect({
    databaseHost,
    databasePort,
    databaseName,
    databaseUser,
    databasePassword,
    databaseClient,
    databasePoolMin,
    databasePoolMax,
  }: ConnectProps): Promise<void> {
    this.databaseHost = databaseHost;
    this.databasePort = databasePort;
    this.databaseName = databaseName;
    this.databaseUser = databaseUser;
    this.databasePassword = databasePassword;
    this.databaseClient = databaseClient;
    this.databasePoolMin = databasePoolMin;
    this.databasePoolMax = databasePoolMax;
    this.client = knex({
      client: 'postgresql',
      connection: {
        host: this.databaseHost,
        database: this.databaseName,
        user: this.databaseUser,
        password: this.databasePassword,
        port: this.databasePort,
      },
      pool: {
        min: this.databasePoolMin,
        max: this.databasePoolMax,
      },
    });

    try {
      await this.client.raw('SELECT 1 + 1');
    } catch (error) {
      throw new Error(`postgresHelper ERROR: ${JSON.stringify(error)}`);
    }
  },

  async disconnect() {
    await this.client.destroy();
    this.client = null;
  },

  async getInstance(): Promise<Knex> {
    if (this.client) return this.client;

    await this.connect({
      databaseHost: process.env.databaseHost,
      databasePort: process.env.databasePort,
      databaseName: process.env.databaseName,
      databaseUser: process.env.databaseUser,
      databasePassword: process.env.databasePassword,
      databaseClient: process.env.databaseClient,
      databasePoolMin: process.env.databasePoolMin,
      databasePoolMax: process.env.databasePoolMax,
    });

    return this.client;
  },
};
