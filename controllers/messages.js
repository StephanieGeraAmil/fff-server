import MessageModel from "../models/messageModel.js";
import ChatModel from "../models/chatModel.js";
import mongoose from 'mongoose';
export const getMessages = async (req,res) =>{
   try{ 
       const messages= await MessageModel.find();
      
        res.status(200).json(messages); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const createMessages=async (req,res) =>{
   const msg=req.body;
   const cht={'_id':msg.chat};
   const newMessage= new MessageModel({content:msg.content, sender: msg.sender});
    
    try { 
        const message= await newMessage.save();
        await ChatModel.findByIdAndUpdate(cht,{ $push: { messages: message } },{new:true})
       
        res.status(201).json(newMessage);
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
    const deleteMessage= await MessageModel.deleteOne({ _id:_id });
    res.status(204).json(deleteMessage);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}

