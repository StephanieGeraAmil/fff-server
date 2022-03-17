import mongoose from 'mongoose';

const chatSchema= mongoose.Schema(
    {
        img:{type:String, default:''},
        date:{type:Date, default:new Date()},
        messages:  {type:Array, default:[]},
       
     
    }
)

const ChatModel= mongoose.model("ChatModel",chatSchema);
export default ChatModel;