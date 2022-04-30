import mongoose from 'mongoose';

export const userSchema= mongoose.Schema(
    {
        name: {type:String, required:true},
        email: {type:String, required:true},
        birthDate:{type:Date},
        gender:{type:String, default:''},
        aproxcoords: {
                    lat: { type: Number },
                    lng: { type: Number }
                },
        city: {type:String},
       
        date:{type:Date, default:new Date()},
     
    }
)

const UserModel= mongoose.model("UserModel",userSchema);
export default UserModel;