const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email: email})
    if(!user){
        done(null, false, req.flash('error_msg','Este correo no está dado de alta'))
    } else{
        const match = await user.matchPassword(password)
        if (match){
            done(null, user, req.flash('message','Bienvenido '+ user.name))
        } else {
            done(null, false, req.flash('error_msg', 'Contraseña incorrecta'))
        }
    }
}))


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

