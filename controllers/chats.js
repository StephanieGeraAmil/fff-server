import ChatModel from "../models/chatModel.js";
import mongoose from 'mongoose';
export const getChats = async (req,res) =>{
   try{ 
       const chats= await ChatModel.find();
      
        res.status(200).json(chats); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const getChatsFromUser = async (req,res) =>{
     const {id:_id}=req.params;
   try{ 
       const chats= await ChatModel.find({"users":{$elemMatch: {_id:_id}}});
      
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
    const deleteChat= await ChatModel.deleteOne({ _id:_id });
    res.status(204).json(deleteChat);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}

