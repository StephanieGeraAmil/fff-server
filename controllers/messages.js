import MessageModel from "../models/messageModel.js";
import ChatModel from "../models/chatModel.js";


import mongoose from 'mongoose';

import {io} from '../index.js';


export const getMessages = async (req,res) =>{
   try{ 

      const messages= await MessageModel.find();
      res.status(200).json(messages); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const getMessagesFromChat = async (req,res) =>{
   const {id:_id}=req.params;
   try{ 
           console.log("getmessagesfrom chat")
      const chat=await ChatModel.findById(_id)
      let messagesFromChat=[];
      const messagesIds= chat.messages;
      for (let item of messagesIds) {
          const msg= await  MessageModel.findById(item.toString());
         messagesFromChat.push(msg);

      }
   
      res.status(200).json(messagesFromChat); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}

export const createMessages=async (req,res) =>{
   console.log("create-message")
   const msg=req.body;
   const cht={'_id':msg.chat};
   const newMessage= new MessageModel({content:msg.content, sender: msg.sender});  
    try { 
        const message= await newMessage.save();
        await ChatModel.findByIdAndUpdate(cht,{ $push: { messages: message._id } },{new:true})
              console.log("just about to emmited");
        io.emit('new-message', message);
        console.log("emited")
  
     
        res.status(201).json(message);
   }catch(error){
       res.status(409).json({message:error.message});
   }
}


export const updateMessage=async (req,res) =>{
   const {id:_id}=req.params;
   const updated=req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"}); 
  try{
    const updatedMessage= await MessageModel.findByIdAndUpdate(_id,updated,{new:true});
    res.status(204).json(updatedMessage);
   }catch(error){ 
      res.status(409).json({message:error.message});
   }
}

export const deleteMessage=async (req,res) =>{
   const {id:_id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"}); 
   try{
      //I delete the message from the chat that is part of
      await ChatModel.updateOne({messages:_id.toObject()},{ $pull: { messages: _id.toObject()} },{new:true});

      const deleteMessage= await MessageModel.deleteOne({ _id:_id });
      res.status(204).json(deleteMessage);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}
export const deleteAllMessages=async (req,res)=>{
     try{ 
        //I delete all message references on chats too
         await ChatModel.updateMany({},{messages:[]});
         await MessageModel.deleteMany({});
         res.status(200).json("all messages deleted"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}


export const init=()=> {
    
      io.on("connection", socket => {  
       try{ 
            socket.on("get-last-100-messages",async (chat_id)=>{
                        
                        try{ 
                           console.log("last-messages-requested");
                            socket.join(chat_id);
                            const chat=await ChatModel.findById(chat_id);
                            let messagesFromChat=[];
                            const messagesIds= chat.messages;
                            for (let item of messagesIds) {
                                const msg= await  MessageModel.findById(item.toString());
                                messagesFromChat.push(msg);
                            } 
                        //if boradcast instead of  io.emit  the sender is not notified
                        //socket.broadcast.emit('new-message',obj)
                        //to already does the boradcast 
                            io.in(chat_id).emit('last-100-messgaes-from-chat',messagesFromChat)
                        
                        }catch(error){
                            console.log({message:error.message});
                        } 
            });
            socket.on("message-sent",async (obj,chat_id)=>{
                       
                        try{ 
                           console.log("message-received by db");
                            const cht={'_id':chat_id};
                            
                            const newMessage= new MessageModel({content:obj.content, sender: obj.sender});  
                            const message= await newMessage.save();
                                   
                            await ChatModel.findByIdAndUpdate(cht,{ $push: { messages: message._id } },{new:true})  
                            io.in(chat_id).emit('new-message', message);
                           
                        
                        }catch(error){
                             console.log({message:error.message});
                        }
                    }
                );
         }catch(error){
                    console.log({message:error.message});
                }
    });


}

