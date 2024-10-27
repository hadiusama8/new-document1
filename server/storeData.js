// storeData.js
const admin = require('./firebase'); // Import your firebase setup

async function storeDocument() {
  // Reference to the Firestore database
  const db = admin.firestore();

  // Data to store
  const data = {
    title: "3 Document",
    content: "This is the latest example of storing data in Firebase.",
    createdAt: new Date(),
  };

  try {
    // Add a new document with a generated ID
    const docRef = await db.collection('sanika-demo').add(data);
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

// Call the function to store data
storeDocument();


async function fetchDocuments() {
    const db = admin.firestore();
  
    try {
      const snapshot = await db.collection('sanika-demo').get();
      snapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  }
  
  // Call the function to fetch data
  fetchDocuments();
  