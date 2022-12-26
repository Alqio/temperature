require('dotenv').config();

import { connectClient, getTemperatures, addTemperature } from './db';

connectClient();

import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

const port = process.env.PORT || '8000';

app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'toimii'
  });
});

app.get('/temperatures', async (req, res) => {
  const start = req.query.start as string;
  const end = req.query.end as string;
  let temperatures = await getTemperatures(start, end);
  res.json(temperatures);
});

app.post('/temperature', (req, res) => {
  const { timestamp, temperature } = req.body;
  const addedTemperature = addTemperature(temperature, timestamp);
  res.json(addedTemperature);
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
