// Import Firebase Admin SDK
const admin = require('firebase-admin');

// Load the service account key JSON file
const serviceAccount = require('./fir-58713-firebase-adminsdk-i96m7-62fd59193a.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-58713.firebaseio.com", // Use Realtime Database or Firestore
});

// Export admin instance for use in other files
module.exports = admin;
