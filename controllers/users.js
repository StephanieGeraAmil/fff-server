import UserModel from "../models/userModel.js";
import EventModel from "../models/eventModel.js";
import ChatModel from "../models/chatModel.js";
import mongoose from 'mongoose';
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
         const eventToDelete=await EventModel.findOne({"creator":_id});
         const id_chat=eventToDelete.toObject().chat;
         
      if(eventToDelete){
            await ChatModel.deleteOne({_id:id_chat});  
            await EventModel.deleteOne({'creator':_id});
      }else{
         const userToDelete= await UserModel.findById(_id); 
         await ChatModel.updateMany({"users":{$elemMatch: userToDelete}},{ $pull: { users: userToDelete} },{new:true});
      } 
      const deleteUser= await UserModel.deleteOne({ _id:_id });
      res.status(204).json(deleteUser);

     
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}
export const deleteAllUsers=async (req,res)=>{
     try{ 
         await UserModel.deleteMany({});
         res.status(200).json("all users deleted"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}

