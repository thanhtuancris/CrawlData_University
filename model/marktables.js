const mongoose = require("mongoose")

const marktablesSchema = new mongoose.Schema({
    id_student: String,
    tongsotc: String,
    sotctuongduong: String,
    stctln: String,
    dtbc: String,
    dtbcqd: String,
    somonkhongdat: String,
    sotckhongdat: String,
    dtbxltn: String,
    dtbmontn: String,
    entries: Array,
    ngoaikhoa: Array
},{ versionKey: false })
module.exports = mongoose.model("marktables", marktablesSchema);