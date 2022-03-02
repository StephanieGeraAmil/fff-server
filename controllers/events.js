import EventModel from "../models/EventModel.js";
import mongoose from 'mongoose';
export const getEvents = async (req,res) =>{
   try{ 
       const events= await EventModel.find();
      
        res.status(200).json(events); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}
export const createEvents=async (req,res) =>{
   const ev=req.body;
   const newEvent= new EventModel(ev);
    
    try { 
        await newEvent.save();
       
        res.status(201).json(newEvent);
   }catch(error){
  res.status(409).json({message:error.message});
   }
}
export const updateEvent=async (req,res) =>{
   const {id:_id}=req.params;
   const updated=req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   
   
  try{
    const updatedEvent= await EventModel.findByIdAndUpdate(_id,updated,{new:true});
    res.status(204).json(updatedEvent);
   }catch(error){
   res.status(409).json({message:error.message});
   }
}

export const deleteEvent=async (req,res) =>{
   const {id:_id}=req.params;
 
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid id"});
   
   try{
    const deleteEvent= await EventModel.deleteOne({ _id:_id });
    res.status(204).json(deleteEvent);
   }catch(error){
      res.status(409).json({message:error.message});
   }
        
}

