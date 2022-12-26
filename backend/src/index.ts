require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

app.use(bodyParser);
app.use(cors());

const port = process.env.PORT || '8000';

app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'toimii'
  });
});

app.post('/temperature', (req, res) => {
  const { timestamp, temperature } = req.body;
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
