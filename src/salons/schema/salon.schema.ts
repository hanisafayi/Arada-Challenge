import * as mongoose from 'mongoose';
export const SalonSchema =new mongoose.Schema({
    name: {
            type: String,
            required: [true, 'must have a name'],  
            unique: true,   
            trim: true
        },
    picturePath:String,
    location:{
            type: String,
            required: [true, ' must have a location']},
    Description:{
        type:String
    },
    isReported:{
        type: Boolean,
        default: false
    }
    ,isVerified:{
        type: Boolean,
        default:false
    }
    ,isAccepted:{
        type: Boolean,
        default: false
    },
    points:{
        type: Number
    },
    likes:{
        type: Number,
        default: 0
    },
    Reports:{
        type: Number,
        default: 0
    }

})

