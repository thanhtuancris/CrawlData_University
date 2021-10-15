const mongoose = require("mongoose")

const timetablesSchema = new mongoose.Schema({
    id_student: String,
    timetable: Array,
    examtable: Array
},{ versionKey: false })

module.exports = mongoose.model("timetables", timetablesSchema);