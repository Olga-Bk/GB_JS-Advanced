import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';

const GOODS_PATH = './static/goods.json'
const BASKET_GOODS_PATH = './static/basket-goods.json'

function getGoods() {
  return readFile(GOODS_PATH, 'utf-8').then((file) => JSON.parse(file))
}

function getBasketGoods() {
  return readFile(GOODS_PATH, 'utf-8').then((file) => JSON.parse(file))
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/goods', (res, req) => {
  getGoods().then((goods) => {
    req.send(JSON.stringify(goods));
  })
});

app.get('/basketgoods', (res, req) => {
  getBasketGoods().then((basketGoods) => {
    req.send(JSON.stringify(basketGoods));
  })
});

app.listen('8000', () => {
  console.log('server is starting!')
}) 