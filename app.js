const process = require('process');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { routers } = require('./routes');

const { PORT = 3000 } = process.env;

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }).catch((err) => console.log(err));

app.use(routers);

app.listen(PORT);
