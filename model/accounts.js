const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({
	school: String,
    id_student: String,
    code_student: String,
    password: String,
    avatar: String,
    full_name: String,
    birthday: String,
    token: String,
    class: String,
    majors: String,
    course: String,
    date_reg: Date,
    hdt: String,
    codeGT: String,
    coinMH: Number,
    isdelete: String,
    isstatus: String,
    number_phone: String,
    isnoti: Boolean,
    token_firebase: String
    
},{ versionKey: false })

module.exports = mongoose.model("accounts", accountSchema);