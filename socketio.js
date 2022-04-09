import MessageModel from "./models/messageModel.js";
import ChatModel from "./models/chatModel.js";
import {io} from './index.js';


export const init=()=> {

    io.on("connect", socket => {  
   
    socket.on("get-last-100-messages",async (obj,chat)=>{
                
                 try{ 
                    const chat=await ChatModel.findById(_id)
                    console.log("inside get messages")
                    let messagesFromChat=[];
                    const messagesIds= chat.messages;
                    for (let item of messagesIds) {
                        const msg= await  MessageModel.findById(item.toString());
                        messagesFromChat.push(msg);
                    }
                    
                    socket.to(chat).emit('last-100-messgaes-from-chat',messagesFromChat)
                   
                }catch(error){
                    res.status(404).json({message:error.message});
                }
     });
    socket.on("message-sent",(obj,chat)=>{
                //boradcast instead of  io.emit so the sender is not notified
                // socket.broadcast.emit('new-message',obj)
                //to already does the boradcast 
                socket.to(chat).emit('message-created',obj)
              
                }
        );

    });
  
}



