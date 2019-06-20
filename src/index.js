//Modulos
const express = require('express') // Framework Express
const path = require('path') // Concatena rutas 
const phbs = require('express-handlebars') // Motor de vistas
const session = require('express-session') // Express sesion
const flash = require('connect-flash') // Connect flash
const passport = require('passport') // Autenticaciones

// Inicia el modulo Express
const app = express()

require('./dataBase')
require('./config/passport')

// Puerto del servidor
app.set('port', process.env.PORT || 3000)


// La carpeta de vistas
app.set('views', path.join(__dirname, 'views'))

// Motor de plantillas
app.engine('.hbs', phbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))

// Añade el motor de plantillas
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended: false}))

//Para usar la sesion
app.use(session({
    secret: 'secretVar',
    resave: true,
    saveUninitialized: true
}))

// Manda mensajes entre vistas
app.use(flash())

//Para la autenticacion
app.use(passport.initialize())
app.use(passport.session())

// Variables globales
app.use((req, res, next) => {
    res.locals.message = req.flash('message') // Mensaje de exito
    res.locals.error_msg = req.flash('error_msg') // Mensaje de error
    res.locals.user = req.user || null //Usuario autenticado
    next()
})

// Ubicación de las rutas
app.use(require('./routes/index'))
app.use(require('./routes/users'))
app.use(require('./routes/notes'))
app.use(require('./routes/turns'))

// Contenido estático
app.use(express.static(path.join(__dirname, 'public')))

// Comprobación de que funciona el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
});
