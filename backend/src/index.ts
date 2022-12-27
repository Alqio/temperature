require('dotenv').config();
require('express-async-errors');

import { connectClient, getTemperatures, addTemperature, getTemperature } from './db';

connectClient();

import express from 'express';
import cors from 'cors';

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
  }
  if (err.message === 'Missing timestamp' || err.message === 'Missing temperature') {
    res.status(400);
  }

  next(err);
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
