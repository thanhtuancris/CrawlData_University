const mongoose = require("mongoose")

const semesterSchema = new mongoose.Schema({
	idsemester: String,
    namesemester: String,
    schools: String,
    isstatus: String
},{ versionKey: false })

module.exports = mongoose.model("semesters", semesterSchema);