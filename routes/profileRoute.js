const express = require('express')
const router = express.Router();
const auth = require('../middlewares/auth')
const profileController = require('../controllers/profilController')



router.get('/account',profileController.account)
router.get('/account/setting',profileController.setting)
router.post('/account/setting',profileController.updatePassword)

router.get('/:prn',profileController.profileView); 

router.post('/account',profileController.updateAccount);

// **************** All Done ***********************




module.exports = router;