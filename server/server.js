//const { db } = require('./firebase'); // Firebase Firestore instance
const QuillDelta = require('quill-delta');
require('dotenv').config();
const admin = require("./firebase");
const db = admin.firestore();

// Debug: Check if environment variables are loaded
console.log('Environment Variables Check:', {
  FIREBASE_TYPE: process.env.FIREBASE_TYPE,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_COLLECTION: process.env.FIREBASE_COLLECTION
});

db.collection(process.env.FIREBASE_COLLECTION)
  .get()
  .then((snapshot) => {
    console.log(
      "Firestore connection successful, found documents: ",
      snapshot.size
    );
  })
  .catch((error) => {
    console.error("Error connecting to Firestore: ", error);
  });

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const documentUsers = {}; // To store users for each document by documentId

io.on("connection", (socket) => {
  // When a client requests to join a document
  socket.on("get-document", async (documentId, userName) => {
    // Ensure there's a list of users for this document
    if (!documentUsers[documentId]) {
      documentUsers[documentId] = [];
    }

    // Add the new user to the document's user list
    documentUsers[documentId].push({ userName, socketId: socket.id });

    console.log(`User ${userName} joined document ${documentId}`);

    // Join the document room
    socket.join(documentId);

    // Broadcast the updated user list to all clients in the room
    io.to(documentId).emit("user-list", documentUsers[documentId]);

    // Load document data from Firestore
    try {
      const docRef = db.collection(process.env.FIREBASE_COLLECTION).doc(documentId);
      const doc = await docRef.get();

      let documentData = "";
      if (doc.exists) {
        documentData = doc.data().content;
      }
      console.log("loading data", documentData);
      // Send the loaded document to the user
      socket.emit("load-document", documentData);
      console.log(`Loaded document for ${documentId}`);
    } catch (error) {
      console.error(`Error loading document: ${error}`);
    }

    // Handle when the user sends changes to the document
    socket.on("send-changes", async (delta) => {
        // Broadcast changes to other users in the room
        socket.broadcast.to(documentId).emit("receive-changes", delta); // Send only the delta
    
        // Store the updated document in Firestore
       
    });

    //Db saving
    socket.on("db-changes", async(content) => {
        try {
            const docRef = db.collection(process.env.FIREBASE_COLLECTION).doc(documentId);
    //         const doc = await docRef.get(); // Retrieve the current document
    
    //         let currentContent = doc.data().content;
    
    // // Convert the current content to a Delta if it's not already in Delta format
    //         let currentDelta = new Quill.imports.delta(currentContent); // Or handle conversion to Delta if needed
    
    //         const updatedDelta = currentDelta.compose(delta); // Compose merges the changes
    
    
            // Save the merged content as plain text
            await docRef.set({
                content: content, // Store as plain text
                updatedAt: new Date(),
            });
    
            console.log(`Document ${documentId} updated with new content.`);
        } catch (error) {
            console.error(`Error saving document: ${error}`);
        }
    })
    

    // Handle when a user disconnects
    socket.on("disconnect", () => {
      // Remove the user from the document's user list
      documentUsers[documentId] = documentUsers[documentId].filter(
        (user) => user.socketId !== socket.id
      );

      // Broadcast the updated user list
      io.to(documentId).emit("user-list", documentUsers[documentId]);

      console.log(`User ${userName} disconnected from document ${documentId}`);
    });
  });
});
