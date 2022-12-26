import { Client, ClientConfig } from 'pg';

const config: ClientConfig = {
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: Number(process.env.DB_PORT)
};

const client = new Client(config);
client
  .connect()
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((err) => {
    console.log(`Failed to connect to database ${err}`);
  });

const getTemperatures = async () => {
  const temperatures = await client.query('SELECT * FROM temperatures');
};
