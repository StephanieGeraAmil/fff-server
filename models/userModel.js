import mongoose from 'mongoose';

export const userSchema= mongoose.Schema(
    {
        name: {type:String, required:true},
        email: {type:String, required:true},
        birthDate:{type:Date},
        gender:{type:String, default:''},
        aproximatelat:{type:Number, default:0.0},
        aproximatelng:{type:Number, default:0.0},
        date:{type:Date, default:new Date()},
     
    }
)

const UserModel= mongoose.model("UserModel",userSchema);
export default UserModel;