
const Club = require('../models/clubModel');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
const Event = require('../models/eventModel');


exports.index = async(req,res)=>{  // get home page
    const clubs = await Club.find();
    res.render('clubs/index',{
        user:req.user,
        clubs:clubs
    })
}

exports.getOneClub = async (req,res)=>{  // get 
    try {
        const club = await Club.findOne({slug:req.params.id})

        let studentCoordinator = await User.findOne({_id:club.admin});
        let facultyCoordinator = await User.findOne({_id:club.facultyCoordinator});

        let members = []; // liked by
        let teams = [];
        let teamMembers = [[]];
        if(club){
            for(let i = 0;i < club.members.length;i++){
                let member = await User.findOne({_id:club.members[i]});
                members.push(member);
            }
            for(let i = 0;i < club.Teams.length;i++){
                let team = await Team.findOne({_id:club.Teams[i]});
                teams.push(team);
            }
            console.log(teams[0]); 
            console.log(teams[1]); 
            console.log(teamMembers);
            let i = 0;
            for(i =0;i<teams.length;i++){
                // if(teams.members.length == 0) break;
                // console.log(i);
                for(let j =0;j<teams[i].members.length;j++){
                    teamMembers[i][j] = await User.findOne({_id:teams[i].members[j]})
                }
                // console.log(teamMembers);
                teamMembers.push([]);
            }
            // teamMembers.push([]);
            // console.log("jjj");
            // console.log(teamMembers);
            
        }

        // let teams = await Teams.find();
        res.render('clubs/view',{
            success:true,
            club:club,
            user:req.user,
            studentCoordinator:studentCoordinator, 
            facultyCoordinator:facultyCoordinator,
            members,
            teams,
            teamMembers
        })
    } catch (err) { 
        res.json({
            success:false,
            message:err.message
        })
    }
}

exports.myClubs = async (req,res)=>{    // not defined
    let clubs = [];
    let club;
    // console.log(req.user);
    let ids = req.user.myclubs;
    for(let i = 0; i < ids.length;i++){
            club = await Club.findOne({_id:ids[i]}) 
            clubs.push(club);
        }
        
        res.render("clubs/myclubs",{ 
            success:true,
            user:req.user, 
            clubs:clubs
        })
}

exports.joinLeaveClub = async (req,res)=>{   // post
    try {
        let id = req.params.id;
        let user_id = req.user._id;
        const club = await Club.findOne({_id:id});
        const user = await User.findOne({_id:user_id})
        if(user.myclubs.includes(id)){    /// Leaving Club
            let index = user.myclubs.indexOf(id);
            user.myclubs.splice(index,1);
            index = club.members.indexOf(user_id);
            club.members.splice(index,1);
        }else{      ///  Joining Club
            club.members.push(user_id);
            user.myclubs.push(id);
        }
        await club.save();
        await user.save();
        // console.log(club.members);
        // console.log(user);

        res.redirect("/clubs/"+club.slug);
    } catch (error) { 
        res.send("err" + error.message)
        // res.redirect('/clubs')
    }
}
    
    /* 
    ---club admin routes ---  GET
    get club edit page
    get team creation page
    get event creation pag
-------------------------------- POST
    edit club page, 
    create team,
    add member
    delete member
    delete team

    create event page
    delete event

    */
const isAdminOfClub = async (user_id,club_slug)=>{   //  implemented if not get back to club home page
        let club = await Club.findOne({slug:club_slug});
        return Object.toString(user_id) == Object.toString(club.admin); 
        // if(isAdminOfClub(req.user._id,req.params.id))   --- how to use with slug
    }

exports.getEditClubPage = async (req,res)=>{  // GET
    let club = await Club.findOne({slug:req.params.id});
    if(isAdminOfClub(req.user._id,req.params.id)){
        return res.render('clubs/editClub',{ 
            success:true,
            user:req.user,
            club:club
        })
    }
    res.redirect('/clubs');
}

exports.updateClub = async (req,res)=>{ // POST
    try {
        if(!isAdminOfClub(req.user._id,req.params.id)){
            return res.redirect('/clubs');
        }
        let club = await Club.findOneAndUpdate({slug:req.params.id},{
            about:req.body.about,
            location:req.body.location,
            website:req.body.website,
            instagram_url:req.body.instagram_url,
            facebook_url:req.body.facebook_url,
            linkedin_url:req.body.linkedin_url,
            tag:req.body.tag
        });
        res.redirect('/clubs/edit/'+club.slug);

    } catch (err) {
        res.redirect('/clubs/edit/'+req.params.id);
    }
}

exports.getCreateTeamPage = async (req,res)=>{  // GET
    let club = await Club.findOne({slug:req.params.id});
    let teams = [];
    if(club){
        for(let i = 0;i<club.Teams.length;i++){
            teams.push(await Team.findOne({_id:club.Teams[i]}))
        }
    }
    
    if(isAdminOfClub(req.user._id,req.params.id)){   //////
        return res.render("teams/manage",{
            success:true,
            user:req.user,
            club:club,
            teams
        })
    }
    res.redirect('/clubs');
}

exports.getMembersPage = async (req,res)=>{  // GET
    try {
        if(!isAdminOfClub(req.user._id,req.params.id)){
            return res.redirect('/clubs');
        }
        let club  = await Club.findOne({slug:req.params.id});
        let team = await Team.findOne({_id:req.params.tid});
        let students = await User.find({role:"Student"}).sort('full_name')
        members = [];
        let m;
        for(let i = 0;i < team.members.length;i++){
            m = await User.findOne({_id:team.members[i]});
            members.push(m);
        }
        
        res.render("teams/members",{
            success:true,
            user:req.user,
            members,
            club,
            users:students,
            team
        })
        
    } catch (err) {
        console.log(err.message);
        res.redirect('/clubs');
    }
}

exports.addMember = async (req,res)=>{ // POST
    try {
        let team = await Team.findOne({_id:req.params.tid});
        if(team.members.includes(req.body.member)){
            return res.redirect('/clubs/teams/'+req.params.id+"/"+req.params.tid);
        }
        team.members.push(req.body.member);
        await team.save();
        res.redirect('/clubs/teams/'+req.params.id+"/"+req.params.tid);
        
    } catch (err) {
        res.redirect('/clubs');
    }
}

exports.deleteMember = async (req,res)=>{ // DELETE
    try {
        let team = await Team.findOne({_id:req.params.tid});
        if(team.members.includes(req.body.member)){
            return res.redirect('/clubs/teams/'+req.params.id+"/"+req.params.tid);
        }
        let i = team.members.indexOf(req.params.uid);
        team.members.splice(i,1);
        await team.save();
        res.redirect('/clubs/teams/'+req.params.id+"/"+req.params.tid);
        
    } catch (err) {
        res.redirect('/clubs');
    }
}

exports.createTeam = async (req,res)=>{  // POST
    try {
        if(!isAdminOfClub(req.user._id,req.params.id)){
            return res.redirect('/clubs');
        }
        let club = await Club.findOne({slug:req.params.id})
        let team = await Team.create({
            team_name:req.body.team_name
        })
        club.Teams.push(team._id);
        await club.save();
        res.redirect('/clubs/teams/'+req.params.id);
    } catch (err) {
        res.redirect('/clubs');
    }

}

exports.deleteTeam = async (req,res)=>{ // DELETE
    try {
        if(!isAdminOfClub(req.user._id,req.params.id)){
            return res.redirect('/clubs');
        }
        let club = await Club.findOne({slug:req.params.id});
        let i = club.Teams.indexOf(req.params.tid);
        club.Teams.splice(i,1);
        let team = await Team.findOneAndDelete({_id:req.params.tid});
        await club.save();
        res.redirect('/clubs/teams/'+req.params.id)
        
    } catch (err) {
        res.send(err.message)
        // res.redirect('/clubs');
    }
}





exports.getCreateEventPage = async (req,res)=>{
    let club = await Club.findOne({slug:req.params.id});
    let admin_id = await User.findOne({_id:club.admin});

    if(admin_id.prn == req.user.prn){   ///// 
        return res.json({
            success:true,
            user:req.user,
            club:club
        })
    }
    res.redirect('/clubs');
}

exports.createEvent = async (req,res)=>{

}







