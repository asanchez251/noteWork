const helpers = {}

// Autenticacion de usuario
helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Inicia sesión para continuar')
    res.redirect('/')
}

module.exports = helpers