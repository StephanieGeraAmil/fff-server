
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
//import router from './routes/router.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
//conecting to a BD
// app.use('/movements',movementsRouter);
// app.use('/jars',jarsRouter);
// app.use('/transactions',transactionsRouter);

//initial greeting
app.get('/',(req,res)=>{ res.send('Hello to the fff Aplication')});

const CONNECTION_URL= process.env.CONNECTION_URL;
const PORT= process.env.PORT||5500;
mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=> console.log(`server running on port: ${PORT}`)))
.catch((error)=>console.log(error.message));
// mongoose.set('useFindAndModify', false);

