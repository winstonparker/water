import { initializeApp,  applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter }  from 'firebase-admin/firestore';
import { promises as fs } from 'fs';

/**
 * Creates a new document in a Firestore collection with a generated ID.
 * @param {string} collectionName - The name of the collection.
 * @param {Object} data - The data to insert into the new document.
 */
export async function createNewDocument(collectionName, data) {
  try {
    data.timestamp = FieldValue.serverTimestamp();
    const docRef = await db.collection(collectionName).add(data);
    console.log('New document created with ID:', docRef.id);
    return docRef.id; // Return the new document ID
  } catch (error) {
    console.error('Error creating new document:', error);
  }
}

/**
 * Asynchronously loads JSON data from a file.
 * @param {string} path - The path to the JSON file.
 * @returns {Promise<Object>} The parsed JSON object from the file.
 */
export async function loadServiceAccount(path) {
  try {
      const rawData = await fs.readFile(path, { encoding: 'utf8' });
      return JSON.parse(rawData);
  } catch (error) {
      console.error('Error loading JSON file:', error);
      throw error;
  }
}

// Initialize admin creds
const serviceAccount = await loadServiceAccount("key.json");
initializeApp({
  credential: cert(serviceAccount)
});

// Initialize Firebase
const db = getFirestore();

