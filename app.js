const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const app = express(); 


const auth = require('./middlewares/auth')   


const landingRouter = require('./routes/landingRoute')
const clubRouter = require('./routes/clubRoute');
const adminRouter = require('./routes/adminRoute')
const profileRouter = require('./routes/profileRoute')

app.use(express.json()) 
app.use(bodyParser.urlencoded({ 
    extended: false
})); 
 
app.set("view engine", "pug") 
app.use(express.static('public'))  
app.use(cookieParser())
app.use(methodOverride('_method')) 

app.use('/', landingRouter)
app.use('/clubs', auth.isAuthenticatd, clubRouter); // critical
app.use('/admin', auth.isAuthenticatd, auth.isFaculty, adminRouter)
app.use('/users', auth.isAuthenticatd, profileRouter)
  
app.get('*', (req, res) => {   
    res.render("404")
})
module.exports = app;