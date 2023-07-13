const User = require('../models/userModel');
const Club = require('../models/clubModel');

exports.adminDashboard = async(req,res)=>{  // get
    try {
        let students = await User.find({role:"Student"})
        let faculty = await User.find({role:"Teacher"})
        let users = await User.find().sort({"role":-1});
        let clubs = await Club.find();
        let admins = [];
        let faculties = [];
        for(let i=0;i<clubs.length;i++){
            let admin = await User.findOne({_id:clubs[i].admin})
            admins[i] = admin.full_name + " (" + admin.email+")";
        }
        for(let i=0;i<clubs.length;i++){
            let faculty = await User.findOne({_id:clubs[i].facultyCoordinator})
            faculties[i] = faculty.full_name + " (" + faculty.email+")";
        }


        res.render('admin/dashboard',{
            sCount:students.length,
            fCount:faculty.length,
            clubCount:clubs.length, 
            clubs:clubs,
            users:users,
            user:req.user,  // logged in user
            admins:admins,
            faculties:faculties,
            delUser:false
        })
    } catch (err) {
        res.json({
            success:false,
            message:err.message
        })
    }
    
}

exports.createClubForm = async(req,res)=>{   // get 
    const users = await User.find({role:"Student"});
    res.render('admin/createClub',{
        user:req.user,
        users:users
    })
}

exports.createClub = async (req,res)=>{  // post
    try{

        let club = await Club.create({
            club_name:req.body.club_name,
            about:req.body.about,
            admin:req.body.admin,
            location:req.body.location,
            tag:req.body.tag,
            facultyCoordinator:req.user._id
        }) 
        await club.save();
        res.redirect('/clubs')
    }catch(err){
        res.json({
            success:false,
            message:err.message
        })
    }
}


exports.makeAdmin = async (req,res)=>{  // post
    let user = await User.findById({_id:req.params.id})
    if(user.role == "Student")
        user = await User.updateOne({_id:req.params.id},{role:"Teacher"})
    else    
        user = await User.updateOne({_id:req.params.id},{role:"Student"})
    res.redirect('/admin')
}

exports.deleteUser = async (req,res)=>{   // post
    const clubs = await Club.find({});
    const user1 = await User.findOne({_id:req.params.id})  // user to be deleted
    for(var i = 0;i < clubs.length;i++){
        if(Object.toString(clubs[i]._id) == Object.toString(user1._id || Object.toString(req.user._id) == Object.toString(user1._id))){
            let students = await User.find({role:"Student"})
            let faculty = await User.find({role:"Teacher"})
            let users = await User.find().sort({"role":-1});
            let clubs = await Club.find();
            let admins = [];
            let faculties = [];
            for(let i=0;i<clubs.length;i++){
                let admin = await User.findOne({_id:clubs[i].admin})
                admins[i] = admin.full_name + " (" + admin.email+")";
            }
            for(let i=0;i<clubs.length;i++){
                let faculty = await User.findOne({_id:clubs[i].facultyCoordinator})
                faculties[i] = faculty.full_name + " (" + faculty.email+")";
            }
    
    
            return res.render('admin/dashboard',{
                sCount:students.length,
                fCount:faculty.length,
                clubCount:clubs.length, 
                clubs:clubs,
                users:users,
                user:req.user,  // logged in user
                admins:admins,
                faculties:faculties,
                delUser:true
            })
        }
    }
    const user = await User.deleteOne({_id:req.params.id})
    res.redirect('/admin') 
}

exports.deleteClub = async (req,res)=>{
    const club = await Club.deleteOne({_id:req.params.id})
    res.redirect('/admin')
}

/**
 * 
 * edit club admin
 * /admin/:id
 * delete club
 */

exports.updateClubAdminForm = async (req,res)=>{
    const users = await User.find({role:"Student"});
    const club = Club.findOne({_id:req.params.id});
    res.render('admin/updateAdmin',{
        user:req.user,
        users:users,
        admin_id:req.params.id
    })
}

exports.updateClubAdmin = async (req,res)=>{
    try {
        const club = await Club.findOneAndUpdate({_id:req.params.id},{admin:req.body.admin})
        res.redirect('/admin');
    } catch (err) {
        res.json({
            success:false,
            message:err.message
        })
    }
}