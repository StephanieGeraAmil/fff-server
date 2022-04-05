import UserModel from "../models/userModel.js";
import EventModel from "../models/eventModel.js";
import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";


export const clearUpDB=async (req,res)=>{
     try{ 
         await MessageModel.deleteMany({});
         await ChatModel.deleteMany({});
         await EventModel.deleteMany({});
         await UserModel.deleteMany({});
         res.status(200).json("all BD is cleared up"); 
   }catch(error){
     res.status(404).json({message:error.message});
   }
}