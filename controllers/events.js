import EventModel from "../models/eventModel.js";
import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";


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
   let eventsWithuserInfo=[];
  
   try{       
         const chatsOfUser=  await ChatModel.find({"users":_id });
         const events=await EventModel.find();
         let result={};
         events.map(event=>{
               if(JSON.stringify(chatsOfUser).includes(event.chat)){ 
                  result= {...event._doc, hasTheUser:true};
               }else{
                   result= {...event._doc, hasTheUser:false};
               }
               eventsWithuserInfo.push(result);
         });
        res.status(200).json(eventsWithuserInfo); 
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
   const user=updated.userToAddOrRemove;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid event id"});
 

  try{
    
     if(task && user){
           
         if(!mongoose.Types.ObjectId.isValid(user)) return res.status(404).json({message:"invalid user id"});
         const event=await EventModel.findById(_id);
         const cht=await ChatModel.findById(event.chat);
         if (task=='addUser'){   
            await ChatModel.findByIdAndUpdate(event.chat,{ $push: { users: user } },{new:true}); 
         }else{
            if(task=='deleteUser'){
              await ChatModel.findByIdAndUpdate(event.chat,{ $pull: { users: user } },{new:true});
            }
         }
     }else{
           await EventModel.findByIdAndUpdate(_id,updated, {new: true});    
     }
     const  NewEvent= await EventModel.findById(_id)
     res.status(200).json(NewEvent);  
   }catch(error){ 
      res.status(409).json({message:error.message});
   }
}

export const deleteEvent=async (req,res) =>{
   const {id:_id}=req.params;
 
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).json({message:"invalid event id"});
   
   try{
      const eventToDelete= await EventModel.findById({ _id:_id });
      //I delete the chat asociated with that Event and I first delete all messages asociated with that chat that I'm about to delete
      const chatAsociated= await ChatModel.findOne({ _id:eventToDelete.chat });
      const messagesIdAsociatedWithChat=chatAsociated.messages;
      
      await MessageModel.deleteMany({_id:{"$in":messagesIdAsociatedWithChat}})
      await ChatModel.deleteOne({ _id:eventToDelete.chat });
      const deleteEvent= await EventModel.deleteOne({ _id:_id });
      res.status(200).json(deleteEvent);
   }catch(error){
      res.status(409).json({message:error.message});
   }       
}
export const deleteAllEvents=async (req,res)=>{
     try{ 
         await MessageModel.deleteMany({});
         await ChatModel.deleteMany({});
         await EventModel.deleteMany({});
         res.status(200).json("all events, chats and Messages deleted"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}


