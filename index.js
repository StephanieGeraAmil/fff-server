
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import routerEvents from './routes/events.js';
import routerUsers from './routes/users.js';
import routerChats from './routes/chats.js';
import routerMessages from './routes/messages.js';
import routerGeneral from './routes/general.js';
import MessageModel from "./models/messageModel.js";
import ChatModel from "./models/chatModel.js";
import {init} from './socketio.js' 

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
       try{ 
            socket.on("get-last-100-messages",async (chat_id)=>{
                        
                        try{ 
                            socket.join(chat_id);
                           
                            const chat=await ChatModel.findById(chat_id);
                            let messagesFromChat=[];
                            const messagesIds= chat.messages;
                            for (let item of messagesIds) {
                                const msg= await  MessageModel.findById(item.toString());
                                messagesFromChat.push(msg);
                            } 
                        //if boradcast instead of  io.emit so the sender is not notified
                        //socket.broadcast.emit('new-message',obj)
                        //to already does the boradcast 
                            io.in(chat_id).emit('last-100-messgaes-from-chat',messagesFromChat)
                        
                        }catch(error){
                            console.log({message:error.message});
                        } 
            });
            socket.on("message-sent",async (obj,chat_id)=>{
                       
                        try{ 
                            const cht={'_id':chat_id};
                            const newMessage= new MessageModel({content:obj.content, sender: obj.sender});  
                            const message= await newMessage.save();
                            await ChatModel.findByIdAndUpdate(cht,{ $push: { messages: message._id } },{new:true})  
                            io.in(chat_id).emit('message-created', message);
                           
                        
                        }catch(error){
                             console.log({message:error.message});
                        }
                    }
                );
         }catch(error){
                    console.log({message:error.message});
                }
    });



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



