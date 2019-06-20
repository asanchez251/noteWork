const mongoose = require('mongoose')
const { Schema } = mongoose

const TurnSchema = new Schema({
    day: String,
    enter: String ,
    out: String ,
    total: Number,
    acumulated: Number,
    date: { type: Date, default: Date.now },
    user: { type: String }
})

module.exports = mongoose.model('Turn', TurnSchema)