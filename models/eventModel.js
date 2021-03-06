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
        end_date:{type:Date, default:new Date()},
        target_gender:{type:String, default:''},
        creator: {type:String, required:true},
        chat: {type:String, default:[]}
     
    }
)

const EventModel= mongoose.model("EventModel",eventSchema);
export default EventModel;