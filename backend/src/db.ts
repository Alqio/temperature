import { Client, ClientConfig } from 'pg';

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

export const getTemperatures = async (start: string | undefined, end: string | undefined) => {
  if (!start || !end) {
    const temperatures = await client.query('SELECT * FROM temperature');
    return temperatures.rows as Datapoint[];
  }
};

export const addTemperature = async (temperature: Number, timestamp: string) => {
  const result = await client.query('INSERT INTO temperature VALUES($1, $2)', [timestamp, temperature]);
  return result.rows as Datapoint[];
};
