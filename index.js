
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import routerEvents from './routes/events.js';
import routerUsers from './routes/users.js';
import routerChats from './routes/chats.js';
import routerMessages from './routes/messages.js';
import routerGeneral from './routes/general.js';
import { createServer } from "http";
import { Server } from "socket.io";




import dotenv from 'dotenv';

dotenv.config();

const app = express();
///////
const httpServer = createServer(app);
const options = {
    cors: {
                origin: '*',
            }
};
const io =new  Server(httpServer, options);
io.on("connection", socket => {  
    console.log(socket.id) ;
    socket.on("message-sent",(obj,chat)=>{
                console.log(obj)
                console.log(chat)
                //boradcast instead of  io.emit so the sender is not notified
                // socket.broadcast.emit('new-message',obj)
                //to already does the boradcast 
                socket.to(chat).emit('new-message',obj)
              
                }
        );

    });


///////

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());


app.use('/events',routerEvents);
app.use('/users',routerUsers);
app.use('/chats',routerChats);
app.use('/messages',routerMessages);
app.use('/general',routerGeneral);



//initial greeting
app.get('/',(req,res)=>{ res.send('Hello to the fff Aplication')});






const CONNECTION_URL= process.env.CONNECTION_URL;
const PORT= process.env.PORT||5500;
mongoose.connect(CONNECTION_URL,{useNewUrlParser:true, useUnifiedTopology:true})
// .then(()=>app.listen(PORT,()=> console.log(`server running on port: ${PORT}`)))
.then(()=>httpServer.listen(PORT,()=> console.log(`server running on port: ${PORT}`)))
.catch((error)=>console.log(error.message));


export {io};



