const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    full_name:{
        type:String,
        required:[true,"Please Enter your full name"]
    },
    email:{
        type:String,
        lowercase:true,
        required:[true,"Please Provide an email"],
        unique:[true,"Email Already exist"],
        validate:{
            validator: function(el){
                return el.endsWith('mitaoe.ac.in') || el.endsWith('maepune.ac.in') 
        }
    }
    },
    mobile_number:{
        type:String,
        required:[true,"Please provide mobile number"],
        unique:[true,"Mobile number already exist"],
        minlength:[10,"Mobile number should be of 10 digits"]
    },
    prn:{ 
        type:String,
        required:[true,"Please provide prn number"], 
        unique:[true,"PRN number already exist"],
        minlength:[4,"PRN should be of 4 digits"]
    },
    study_year:{
        type:String,
        enum:["First Year","Second Year","Third Year","Fourth Year","Pass Out"],
        required:[true,"Please provid your study year"]
    },
    department:{
        type:String,
        enum:["School of Humanities and Engineering Sciences","School of Chemical Engineering","School of Electrical Engineering","School of Computer Engineering and Technology","School of Mechanical and Civil Engineering","School of Design"],
        required:[true,"Please provid your department"]
    },
    role:{
        type:String,
        enum:["Student","Teacher"],
        default:"Student"
    },
    password:{
        type:String,
        select:false,
        minlength:[6,"Password should be greater than 6 character"],
        required:[true,"Please provid your password"]
    },
    createdAt:{
        type:Date,
        immutable:true,
        default:Date.now()
    },
    myclubs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Club"
        }
    ],
    myevents:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:"Event"
        }
    ],
    instagram_url:{
        type:String,
        default:""
    }
    ,facebook_url:{
        type:String,
        default:""
    },
    linkedin_url:{
        type:String,
        default:""
    },
    twitter_url:{
        type:String,
        default:""
    },
    about:{
        type:String, 
        default:""
    },
    profil_pic:{
        type:String,
        default:"default.png" 
    }
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8)
    }
    next();
})


userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET)
}
const User = mongoose.model("User",userSchema); 

module.exports = User;