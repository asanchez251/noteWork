const router = require('express').Router()
const Turn = require('../models/Turn')

const { isAuthenticated } = require('../config/auth')

router.get('/turns/add', isAuthenticated, (req, res) => {
    res.render('turns/add_turns')
})

router.post('/turns/add', isAuthenticated, async (req, res) => {
    const { day, enter, out, total } = req.body
    const acumulated = total - req.user.journey
    const newTurn= new Turn({ day, enter, out, total, acumulated })
    newTurn.user = req.user.id
    await newTurn.save()
    req.flash('message', 'Turno guardado correctamente')
    res.redirect('/turns')
})

router.get('/turns/delete/:id', isAuthenticated, async (req, res) => {
    await Turn.findByIdAndRemove(req.params.id)
    req.flash('message', 'Turno borrado correctamente')
    res.redirect('/turns')
})

//funcion que obtiene el saldo de horas
function saldo(turns){
    var acumulated = 0
    if (turns.length != 0){
        for (var i = 0; i < turns.length; i++){
            acumulated += turns[i].acumulated
        }
    }
    return acumulated
}

router.get('/turns',isAuthenticated, async (req, res) => {
    const turns = await Turn.find({user: req.user.id}).sort({date: "desc"})
    var acumulated = saldo(turns)
    res.render('turns/all_turns', { turns, acumulated })
})

module.exports = router