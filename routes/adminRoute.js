const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController')

// /admin
router.get('/',adminController.adminDashboard)

router.get('/new',adminController.createClubForm)

router.post('/new',adminController.createClub)

router.post('/club/:id',adminController.deleteClub); // not used (method overrided)
router.delete('/club/:id',adminController.deleteClub);

router.get('/club/:id',adminController.updateClubAdminForm)
router.post('/clubUpdate/:id',adminController.updateClubAdmin); // change student coordinator

router.post('/:id',adminController.makeAdmin)
router.delete('/:id',adminController.deleteUser);

// **************** All Done ***********************





module.exports = router;