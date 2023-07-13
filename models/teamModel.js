const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    team_name:{
        type:String,
        required:[true,"Plese provide team name"]
    },
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
}); 

const Team = mongoose.model('Team',teamSchema) 

module.exports = Team;