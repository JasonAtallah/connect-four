import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.get('/', function (req, res) {
  console.log(`Request body: ${req.body}`);
  res.send('Hello World!');
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});