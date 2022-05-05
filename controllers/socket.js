import MessageModel from "../models/messageModel.js";
import ChatModel from "../models/chatModel.js";
import EventModel from "../models/eventModel.js";
import mongoose from 'mongoose';
import {io} from '../index.js';

export const init=()=> {
      io.on("connection", socket => {  
       try{ 
            socket.on("get-last-100-messages",async (chat_id)=>{
                        
                        try{ 
                            socket.join(chat_id);
                            const chat=await ChatModel.findById(chat_id);
                            let messagesFromChat=[];
                            const messagesIds= chat.messages;
                            for (let item of messagesIds) {
                                const msg= await  MessageModel.findById(item.toString());
                                messagesFromChat.push(msg);
                            } 
                        //if boradcast instead of  io.emit  the sender is not notified
                        //socket.broadcast.emit('new-message',obj)
                        //to already does the boradcast 
                            io.in(chat_id).emit('last-100-messgaes-from-chat',messagesFromChat);
                        }catch(error){
                            console.log({message:error.message});
                        } 
            });
            socket.on("message-sent",async (obj,chat_id)=>{
                        try{ 
                            const cht={'_id':chat_id};
                            const newMessage= new MessageModel({content:obj.content, sender: obj.sender});  
                            const message= await newMessage.save();       
                            await ChatModel.findByIdAndUpdate(cht,{ $push: { messages: message._id } },{new:true})  
                            io.in(chat_id).emit('new-message', message);
                        }catch(error){
                             console.log({message:error.message});
                        }
                    }
                );
            socket.on("get-events-near",async ()=>{  
                        try{ 
                           const events= await EventModel.find(); 
                           io.emit('events-near',events);
                        }catch(error){
                            console.log({message:error.message});
                        } 
            });
            socket.on("get-events-with-user-info",async (obj)=>{  
                        try{ 
                              let eventsWithuserInfo=[];
                              const chatsOfUser=  await ChatModel.find({"users":obj._id });
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
                              io.emit('events-with-user-info',eventsWithuserInfo);
                        }catch(error){
                            console.log({message:error.message});
                        } 
            });
            socket.on("event-created",async (obj)=>{
                        console.log('an event has been created')
                        console.log(obj)
                        if(obj.creator||obj.title){
                           try{ 
                              const newEvent= new EventModel(obj);
                              const event={users:[newEvent.creator], img:newEvent.img , title:newEvent.title  };
                              const newChat= new ChatModel(event);
                              const chat =await newChat.save();
                              newEvent.chat=chat._id;
                              const savedEvent =await newEvent.save(); 
                               console.log('I am notifying that an event has been created')
                              io.emit('new-event', savedEvent);
                           }catch(error){
                              console.log({message:error.message});
                           }
                        }
                    }
                );
            socket.on("update-event",async (obj)=>{
                     
                        const task=obj.task;
                        const user=obj.userToAddOrRemove;
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
                                    await EventModel.findByIdAndUpdate(obj._id,obj.event, {new: true});    
                              }
                              const  updatedEvent= await EventModel.findById(obj._id)
                              io.emit('event-updated', updatedEvent);
                           }catch(error){
                              console.log({message:error.message});
                           }
                        }
                    
                );
         }catch(error){
                    console.log({message:error.message});
                }
    });


}

