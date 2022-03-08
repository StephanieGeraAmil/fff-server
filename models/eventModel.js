import mongoose from 'mongoose';

const eventSchema= mongoose.Schema(
    {
        title: {type:String, required:true},
        description:  {type:String, default:''},
        type:  {type:String, default:''},
        img:{type:String, default:''},
        lat:{type:Number, default:0.0},
        lng:{type:Number, default:0.0},
        date:{type:Date, default:new Date()},
        users:  {type:Array, default:[]},
        creator: {type:String, required:true},
     
    }
)

const EventModel= mongoose.model("EventModel",eventSchema);
export default EventModel;