require('dotenv').config();
const express = require('express');
const { connectDB } = require('./src/config/db');
const cookieParser = require('cookie-parser');

const mainRouter = require('./src/api/routes/main');
const cors = require('cors');
const { connectCloudinary } = require('./src/config/configCloudinary');
const corsOptions = {
  // origin: 'http://localhost:5173',
  origin: 'https://events-hub-nine.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
  credentials: true
};

const app = express();
connectDB();
connectCloudinary();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', mainRouter);
app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});

app.listen(3000, () => {
  console.log('Servidor levantado en: http://localhost:3000');
});
