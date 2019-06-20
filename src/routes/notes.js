const router = require('express').Router()

const Note = require('../models/Note')
const { isAuthenticated } = require('../config/auth')

router.post('/notes/add', isAuthenticated, async (req, res) => {
    const { title, description } = req.body
    const newNote = new Note({ title, description })
    newNote.user = req.user.id
    await newNote.save()
    req.flash('message', 'Nota añadida correctamente')
    res.redirect('/notes')
})

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'})
    res.render('notes/all_notes', { notes })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id)
    res.render('notes/edit_notes', { note })
})

router.post('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const {title, description } = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('message', 'Nota actualizada correctamente')
    res.redirect('/notes')
})

router.get('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndRemove(req.params.id)
    req.flash('message', 'Nota borrada correctamente')
    res.redirect('/notes')
})

module.exports = router