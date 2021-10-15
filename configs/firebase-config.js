var admin = require("firebase-admin");

var serviceAccount = require("./nht98.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://student-social-5dcc1-default-rtdb.firebaseio.com"
});

module.exports.admin = admin