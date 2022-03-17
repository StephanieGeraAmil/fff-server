import mongoose from 'mongoose';

const messageSchema= mongoose.Schema(
    {
        content:{type:String, default:''},
        sender:{type:String, default:''},
        date:{type:Date, default:new Date()},
        viewBy:  {type:Array, default:[]},
       
     
    }
)

const MessageModel= mongoose.model("MessageModel",messageSchema);
export default MessageModel;