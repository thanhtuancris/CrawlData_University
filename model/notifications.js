const mongoose = require("mongoose")

const notificationsSchema = new mongoose.Schema({
    school: String,
    title: String,
    events: String,
    class: String,
    full_name: String,
    time: Date,
    type: String
},{ versionKey: false })

module.exports = mongoose.model("notifications", notificationsSchema);