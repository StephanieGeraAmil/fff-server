import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";
import EventModel from "../models/eventModel.js";


import mongoose from 'mongoose';


export const getChats = async (req,res) =>{
   try{ 
      const chats= await ChatModel.find();
      res.status(200).json(chats); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const getChatsOfUser = async (req,res) =>{
     const {id:_id}=req.params;
   try{ 
      const chats= await ChatModel.find({"users":_id });
      res.status(200).json(chats); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const createChats=async (req,res) =>{
   const ev=req.body;
   const newChat= new ChatModel(ev);
    try { 
        await newChat.save();
        res.status(201).json(newChat);
   }catch(error){
  res.status(409).json({message:error.message});
   }
}
export const updateChat=async (req,res) =>{
   const {id:_id}=req.params;
   const updated=req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   
  try{
    const updatedChat= await ChatModel.findByIdAndUpdate(_id,updated,{new:true});
    res.status(204).json(updatedChat);
   }catch(error){  
   res.status(409).json({message:error.message});
   }
}

export const deleteChat=async (req,res) =>{
 
   const {id:_id}=req.params;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   try{
      //I delete the reference to the chat before deleting the
       await EventModel.updateOne({chat:_id},{chat:""});
       
       //I delete messages before deleting the chat
      const Chat= await ChatModel.findById(_id );
      const messagesIdsOfChat=Chat.messages;
      messagesIdsOfChat.map(async(item)=> {
                     await MessageModel.deleteOne({ _id:item});
                   });

      const deleteChat= await ChatModel.deleteOne({ _id:_id });
      res.status(204).json(deleteChat);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}
export const deleteAllChats=async (req,res)=>{
     try{ 
         await EventModel.updateMany({},{chat:""});
         await MessageModel.deleteMany({});
         await ChatModel.deleteMany({});
         res.status(200).json("all chats and messages are deleted"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }


   
}

