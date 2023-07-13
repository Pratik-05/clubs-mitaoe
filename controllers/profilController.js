const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { findOne } = require('../models/userModel')

exports.profileView = async(req,res)=>{  // get
    const user = await User.findOne({prn:req.params.prn});
    res.render('profile/view',{
        success:true,
        User:user,
        user:req.user
    })
}

exports.account = async(req,res)=>{  // get 
    // console.log(req.user);
    res.render('profile/account',{
        success:true,
        user:req.user
    })
}

exports.updateAccount = async (req,res)=>{  // post 
    try {
        // console.log(req.body);
        const user = await User.updateOne({_id:req.user._id},req.body)
  
        res.redirect('/users/account')
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }

    // update password
}

exports.setting = (req,res)=>{  // change password // get
    res.render('profile/setting',{ 
        success:true,
        user:req.user,
        done:false,
        message:""
    })
}

exports.updatePassword = async (req,res)=>{  // put
    try {
        if(req.body.password.length < 6){
            return res.render('profile/setting',{ 
                success:false,
                user:req.user,
                done:false,
                message:"Password must be of length 8"
            })
        }
        let pass = await bcrypt.hash(req.body.password,8);
        const user = await User.updateOne({_id:req.user._id},{password:pass})
        // const user = await User.findOne({_id:req.user._id}).select('+password')
        // user.password = req.body.password;
        // user.save();
        
        res.render('profile/setting',{ 
            success:true,
            user:req.user,
            done:true,
            message:""
        })
    } catch (error) {
        res.json({
            success:false,
            message:error.message 
        })
    }
    
}



// delete account  not implementing..--->> not providing to students
