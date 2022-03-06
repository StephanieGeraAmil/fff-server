import mongoose from 'mongoose';

const userSchema= mongoose.Schema(
    {
        name: {type:String, required:true},
        email: {type:String, required:true},
        events:  {type:Array, default:[]},
        chats:  {type:Array, default:[]},
        birthdate:{type:Date,default:new Date()},
        gender:{type:String, default:''},
        aproximatelat:{type:Number, default:0.0},
        aproximatelng:{type:Number, default:0.0},
        date:{type:Date, default:new Date()},
     
    }
)

const UserModel= mongoose.model("UsertModel",userSchema);
export default UserModel;