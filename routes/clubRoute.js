const express = require('express')
const auth = require('../middlewares/auth') 
const clubController = require('../controllers/clubController')
const router = express.Router()


router.get('/',clubController.index)  // home page

router.get('/my',clubController.myClubs) //

router.get('/:id',clubController.getOneClub);    // Club Page

router.post('/join/:id',clubController.joinLeaveClub)  // Join and Leave Button API

/// student admin routes /// -----TEAMS and EVENTS --- id == slug all

router.get('/edit/:id',clubController.getEditClubPage);  // id == slug  get club edit page
router.post('/edit/:id',clubController.updateClub)



router.get('/teams/:id',clubController.getCreateTeamPage)   // get team create page
router.get('/teams/:id/:tid',clubController.getMembersPage)  // ----Editing the team members

router.post('/teams/m/:id/:tid',clubController.addMember)  //  add member
router.delete('/teams/m/:id/:tid/:uid',clubController.deleteMember)  // delete member



router.post('/teams/:id',clubController.createTeam)

router.post('/teams/:id/:tid',clubController.deleteTeam)
router.delete('/teams/:id/:tid',clubController.deleteTeam)

router.get('/events/new/:id',clubController.getCreateEventPage)  /// get event create page

// router.post('/events/new/:id',clubController)  /// get event create page




/*
 
*/

module.exports = router;