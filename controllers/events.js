import EventModel from "../models/eventModel.js";
import ChatModel from "../models/chatModel.js";
import UserModel from "../models/userModel.js";
import mongoose from 'mongoose';

export const getEvents = async (req,res) =>{
   try{ 
      const events= await EventModel.find(); 
      res.status(200).json(events); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}

export const getEventsOfUser=async (req,res)=>{
   const {id:_id}=req.params;
   try{       
         const chatsOfUser= await ChatModel.find({"users": { $elemMatch:{_id:_id}}},_id);
         const events=await EventModel.find();
         const eventsOfUser=[];
         events.map(event=>{
               if(chatsOfUser.includes(event.chat)){eventsOfUser.push(event)}
         })

         res.status(200).json(events); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}

export const createEvents=async (req,res) =>{
   const ev=req.body;

   if(!ev.creator||!ev.title)return res.status(404).json({message:"user and title are needed to create an Event"});
    try { 
      
         const newEvent= new EventModel(ev);
         const cht={users:[newEvent.creator], img:newEvent.img , title:newEvent.title  };
         const newChat= new ChatModel(cht);
         const chat =await newChat.save();
         newEvent.chat=chat._id;
         await newEvent.save();
         res.status(201).json(newEvent);

   }catch(error){
  res.status(409).json({message:error.message});
   }
}
export const updateEvent=async (req,res) =>{

   const {id:_id}=req.params;
   const updated=req.body;
   const task=updated.task;
   const user=updated.user;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid event id"});
   let updatedEvent={};
   
  try{
     if(task && user){
         if(!mongoose.Types.ObjectId.isValid(user)) return res.status(404).json({message:"invalid user id"});
         const usr=await UserModel.findById(user);
         const event=await EventModel.findById(_id);
         const cht=await ChatModel.findById(event.chat);
         const alreadyInEvent=cht.users.find(item=>item._id==user);  
         if (task=='addUser'&&!alreadyInEvent){   
            await ChatModel.findByIdAndUpdate(event.chat,{ $push: { users: usr } },{new:true}); 
         }else{
            if(task=='deleteUser'&&alreadyInEvent){
              await ChatModel.findByIdAndUpdate(event.chat,{ $pull: { users: usr } },{new:true});
            }
         }
     }else{
         updatedEvent= await EventModel.findByIdAndUpdate(_id,updated,{new:true});    
     }
      res.status(204).json(updatedEvent);  
   }catch(error){ 
      res.status(409).json({message:error.message});
   }
}

export const deleteEvent=async (req,res) =>{
   const {id:_id}=req.params;
 
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid event id"});
   
   try{
      const eventToDelete= await EventModel.findById({ _id:_id });
      await ChatModel.deleteOne({ _id:eventToDelete.chat });
      const deleteEvent= await EventModel.deleteOne({ _id:_id });
      res.status(204).json(deleteEvent);
   }catch(error){
      res.status(409).json({message:error.message});
   }       
}
export const deleteAllEvents=async (req,res)=>{
     try{ 
         
         await EventModel.deleteMany({});
         res.status(200).json("all events deleted"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}


