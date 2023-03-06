require('dotenv').config(); 

const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const authPORT = 4000;

const authRouter = require('./src/routes/authRoutes');
app.use('/', authRouter);

app.listen(authPORT, ()=>{
    console.log(`Running on port ${authPORT}`);
});