require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authRouter, userRouter, poolRouter } = require('./routes');
const path = require('./config/paths');

const PORT = process.env.PORT || 8000;

const app = express();
const corsOptions = {
  origin: `${process.env.API_HOST}${PORT}`,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
  next();
});

// Router
app.use(path.authBaseURI, authRouter);
app.use(path.userBaseURI, userRouter);
app.use(path.poolBaseURI, poolRouter);

app.listen(PORT, () => {
  console.log(`The server listens on the port ${process.env.API_HOST}${PORT}`);
});
