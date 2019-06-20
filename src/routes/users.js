const router = require('express').Router()
const passport = require('passport')

const { isAuthenticated } = require('../config/auth')

//Models
const User = require('../models/User')

router.get('/users/register', (req, res) => {
    res.render('users/register')
})

router.post('/users/register', async (req, res) => {
    const {name, email, password} = req.body
    //Comprueba que el email no está en uso
    const emailUser = await User.findOne({email: email})
        if(emailUser){
            req.flash('error_msg', 'El correo esta en uso, elija otro')
            res.redirect('/users/register')
        }
        else{
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save()
            req.flash('message', 'Has sido registrado correctamente')
            res.redirect('/users/login')
        }
    }
)

router.get('/users/login', (req, res) => {
    res.render('users/login')
})

router.post('/users/login',(req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/notes',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/users/logout', (req, res) => {
    req.logout()
    req.flash('message', 'Te has desconectado, que pases un buen día')
    res.redirect('/')
})

router.get('/users/profile', isAuthenticated, async (req, res) => {
    res.render('users/profile')
})

router.get('/users/edit', isAuthenticated, async (req, res) =>{
    const user = await User.findById(req.user.id)
    res.render('users/edit_user', {user})
})

router.post('/users/edit', isAuthenticated, async (req, res) => {
    const {name, journey } = req.body
    await User.findByIdAndUpdate(req.user.id, {name, journey})
    req.flash('message','Campos actualizados')
    res.redirect('/users/edit')
})

module.exports = router