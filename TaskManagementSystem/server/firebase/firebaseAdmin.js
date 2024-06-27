// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./task-management-system-cs-01-firebase-adminsdk-dffe0-372de66bf3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
