const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connect(){
    try{
        await mongoose.connect("mongodb://EagleTeam:HuJunk10H04ngTh4ngD3p7r41Nh4tH3M47Tr01@202.182.116.7:27017/StudentSocial?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    }catch(e){
    }
}
module.exports = {connect}