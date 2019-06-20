const mongoose = require('mongoose')

// Ruta de la base de datos
const ruta = 'mongodb://localhost/notework'

// Conecta el modulo mongoose con la base de datos
mongoose.connect(ruta, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('Db is conected'))
.catch(err => console.error(err))