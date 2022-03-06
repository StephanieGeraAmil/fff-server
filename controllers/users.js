import UserModel from "../models/UserModel.js";
import mongoose from 'mongoose';
export const getUsers = async (req,res) =>{
   
   if(Object.keys(req.body).length !== 0){
  
      const userEmail=req.body;
      
      try{ 
      
         const user= await UserModel.findOne( userEmail );
            console.log(user);
         res.status(200).json(user); 
      
      }catch(error){
         res.status(404).json({message:error.message});
      }

   }else{
      try{ 
         const users= await UserModel.find(); 
         res.status(200).json(users); 
      }catch(error){
      res.status(404).json({message:error.message});
      }
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
    const deleteUser= await UserModel.deleteOne({ _id:_id });
    res.status(204).json(deleteUser);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}

