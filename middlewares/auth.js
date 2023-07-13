const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// checks whether user is logged in or not
exports.isAuthenticatd = async(req,res,next)=>{
    try{
        const {token} =req.cookies;
        if(!token){
            return res.redirect('/'); 
        }
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)

        const newUser = await User.findById(decoded._id);
        if(!newUser){
            return res.redirect('/login');
        }
        req.user = newUser;
        next()
    }catch(err){
        res.redirect("/login")
    }
}
// checks whether user is admin or not
exports.isFaculty = async (req,res,next)=>{ 
    const user = req.user;
    if(user.role == "Teacher"){
        next();
    }
    else{
        res.redirect('/clubs')
    }
}

