// Import Firebase Admin SDK
const admin = require('firebase-admin');

// Load the service account key JSON file
const serviceAccount = require('./new-document-d5be0-firebase-adminsdk-fbsvc-456cf9adb0.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://new-document-d5be0.firebaseio.com", // Use Realtime Database or Firestore
});

// Export admin instance for use in other files
module.exports = admin;
