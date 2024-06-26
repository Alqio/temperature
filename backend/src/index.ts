require('dotenv').config();
require('express-async-errors');

import { connectClient, getTemperatures, addTemperature, getTemperature } from './db';

connectClient();

import express from 'express';
import cors from 'cors';
import { fstat, readFileSync, watch } from 'fs';
import { createServer } from 'https';

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || '8000';

app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'ok'
  });
});

app.get('/temperatures', async (req, res) => {
  const start = req.query.start as string;
  const end = req.query.end as string;
  console.log(start, end);
  let temperatures = await getTemperatures(start, end);
  res.json(temperatures);
});

app.get('/temperature', async (req, res) => {
  let temperature = await getTemperature();
  res.json(temperature);
});

app.post('/temperatures', async (req, res) => {
  const { timestamp, temperature } = req.body;
  console.log(`Received new datapoint: ${timestamp}: ${temperature}`);
  if (!timestamp) throw Error('Missing timestamp');
  if (!temperature) throw Error('Missing temperature');

  const addedTemperature = await addTemperature(timestamp, temperature);

  res.json(addedTemperature);
});

// Error handling via express-async-errors
app.use((err: Error, req: express.Request, res: express.Response, next: Function) => {
  res.statusMessage = err.message;
  if (err.message === 'No temperatures found') {
    res.status(404);
    res.json({});
  }
  if (err.message === 'Missing timestamp' || err.message === 'Missing temperature') {
    res.status(400);
  }

  next(err);
});

const readCertsSync = () => {
  const key = readFileSync(process.env.SSL_PRIVATE_KEY || '');
  const cert = readFileSync(process.env.SSL_CERTIFICATE || '');
  
  return {
    key,
    cert
  }

}

if (process.env.NODE_ENV === 'prod') {
  const credentials = readCertsSync();

  const server = createServer(credentials, app);

  let watchTimeOut: NodeJS.Timeout;
  
  watch(process.env.SSL_PRIVATE_KEY || '', () => {
    clearTimeout(watchTimeOut);
    watchTimeOut = setTimeout(() => {
      server.setSecureContext(readCertsSync());
      console.log("Updated certs");
    }, 1000);
  });

  server.listen(port, () => {
    console.log(`HTTPS server is listening on ${port}`);
  });

} else {
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
}
