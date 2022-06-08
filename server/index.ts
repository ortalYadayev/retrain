import express, { RequestHandler } from 'express';
import {json as bodyParserJson} from 'body-parser';
import { dbClient } from './db';
// import { serverAPIPort, APIPath } from '@fed-exam/config';

const APIPath = `/api/tickets`;
console.log('starting server', { port: 33333, path: APIPath });

// console.log('starting server', { serverAPIPort, APIPath });

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
  const data = await db.getTickets();

  res.json(data);
}));

// app.listen(serverAPIPort);
// console.log('server running', serverAPIPort)

app.listen(33333);
console.log('server running', 33333)

