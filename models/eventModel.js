const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    event_name:{
        type:String,
        required:[true,"Please provide event name"]
    },
    description:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    venue:{ 
        type:String,
        required:true
    },
    venuLink:{
        type:String,

    },
    time:{
        type:Date,
        required:true
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
});

const Event = mongoose.model('Event',eventSchema)

module.exports = Event;