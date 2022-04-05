import UserModel from "../models/userModel.js";
import EventModel from "../models/eventModel.js";
import ChatModel from "../models/chatModel.js";

import mongoose from 'mongoose';
import MessageModel from "../models/messageModel.js";


export const getUsersByEmail = async (req,res) =>{
 const {email:userEmail}=req.params;
 
   try{ 
   
      const user= await UserModel.findOne( {email:userEmail} );
      res.status(200).json(user); 
   
   }catch(error){
      res.status(404).json({message:error.message});
   }
}
export const getUsers = async (req,res) =>{

 
      try{ 
         const users= await UserModel.find(); 
         res.status(200).json(users); 
      }catch(error){
      res.status(404).json({message:error.message});
      }
   
}

export const createUsers=async (req,res) =>{
   const us=req.body;
   const newUser= new UserModel(us);
    
    try { 
        await newUser.save();
       
        res.status(201).json(newUser);
   }catch(error){
  res.status(409).json({message:error.message});

   }
}
export const updateUser=async (req,res) =>{
   const {id:_id}=req.params;
   const updated=req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   
   
  try{
    const updatedUser= await UserModel.findByIdAndUpdate(_id,updated,{new:true});
    res.status(204).json(updatedUser);
   }catch(error){
   res.status(409).json({message:error.message});
   }
}

export const deleteUser=async (req,res) =>{
   const {id:_id}=req.params;
 
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   
   try{
         ///I delete all events that were created by that user (I should add a way too transfer pwnership later)
         const eventToDelete=await EventModel.find({"creator":_id});
         //I delete the chats asociated with those events first
         eventToDelete.map(async(e)=>{
           const id_chat= e.toObject().chat;
           //I delete the messages asociated with that chat
           const chat=await ChatModel.findById(id_chat);
           const messagesId=chat.messages;
           messagesId.map(async(msgId)=>{
                await MessageModel.deleteOne({ _id:msgId});
           })
           await ChatModel.deleteOne({ _id:id_chat});
           

         })
         await EventModel.deleteMany({'creator':_id});

        //I delete the user from all chats that he is part of
         await ChatModel.updateMany({"users":_id},{ $pull: { users: _id} },{new:true});
         //I delete the user
         const deleteUser= await UserModel.deleteOne({ _id:_id });
         res.status(204).json(deleteUser);

     
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}

//deleting all users is like deleting all DB because everithing is asociated with a user... 



