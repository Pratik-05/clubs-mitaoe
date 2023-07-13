const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing/index')
})
router.get('/signup', (req, res) => {
    res.render("landing/signup",{
        success:true,
        user:{
            full_name:"",
                email:"",
                mobile_number:"",
                prn:"",
                study_year:"",
                department:"",
                password:""
        }
    })
})
router.get('/login', (req, res) => {
    res.render("landing/login", { success: true })
})

// auth routes
router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/logout', userController.logout)

// **************** All Done ***********************


module.exports = router;