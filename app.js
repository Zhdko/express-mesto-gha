const process = require('process');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { routers } = require('./routes');

const { DB_CONN, PORT } = process.env;

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

const app = express();

mongoose.connect(DB_CONN, { useNewUrlParser: true }).catch((err) => console.log(err));

app.use(
  cors({
    credentials: true,
    origin: 'http://mesto.zhdko.nomoredomains.monster',
    exposedHeaders: ['set-cookie'],
  }),
);

app.use(routers);

app.listen(PORT);
