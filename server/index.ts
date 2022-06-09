import express, { RequestHandler } from 'express';
import {json as bodyParserJson} from 'body-parser';
import { dbClient } from './db';
import { serverAPIPort, APIPath } from '@fed-exam/config';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const db = dbClient({filePath: './data.sqlite'});

const PAGE_SIZE = 20;

app.use(bodyParserJson());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

const asyncWrapper = (fn: RequestHandler): RequestHandler => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (e) {
    next(e);
  }
}
app.get('/', (req, res) => {
  res.send('ok');
});

app.get(APIPath, (async (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  const data = await db.getTickets(page);

  res.json(data);
}));

app.post(APIPath, (async (req, res) => {
  const payload = req.body;

  try {
    await db.clone(payload);

    res.status(201).json();
  } catch (error) {
    res.status(422).json({ message: 'All fields are required' });
  }

}));

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

