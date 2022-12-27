import { Client, ClientConfig } from 'pg';
import { Datapoint } from './types';

const config: ClientConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT)
};

const client = new Client(config);

export const connectClient = () => {
  client
    .connect()
    .then(() => {
      console.log(`Connected to database`);
    })
    .catch((err) => {
      console.log(`Failed to connect to database ${err}`);
    });
};

export const getTemperature = async () => {
  const temperature = await client.query('SELECT * FROM temperature ORDER BY timestamp DESC LIMIT 1');

  if (temperature.rowCount == 0) throw Error('No temperatures found');

  return temperature.rows[0];
};

export const getTemperatures = async (start: string | undefined, end: string | undefined) => {
  if (!start || !end) {
    const temperatures = await client.query('SELECT * FROM temperature');
    return temperatures.rows as Datapoint[];
  }
  const temperatures = await client.query('SELECT * FROM temperature WHERE timestamp >= $1 AND timestamp <= $2', [
    start,
    end
  ]);
  return temperatures.rows as Datapoint[];
};

export const addTemperature = async (timestamp: string, temperature: Number) => {
  const result = await client.query('INSERT INTO temperature (timestamp, temperature) VALUES($1, $2) RETURNING *', [
    timestamp,
    temperature
  ]);
  return result.rows[0] as Datapoint[];
};
