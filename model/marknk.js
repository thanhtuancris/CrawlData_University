const mongoose = require("mongoose")

const marknkSchema = new mongoose.Schema({
    id_student: String,
    total: Number,
    waiting: Number,
    entries: Array
},{ versionKey: false })
module.exports = mongoose.model("marknks", marknkSchema);