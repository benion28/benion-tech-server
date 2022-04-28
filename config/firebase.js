const admin = require("firebase-admin");
const serviceAccount = require("../benion-database.json");

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://benion-database.firebaseio.com",
    authDomain: "benion-database.firebaseapp.com"
});

module.exports = admin.database();