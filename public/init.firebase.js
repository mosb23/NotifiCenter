const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const firebaseKeyPath = process.env.FIREBASE_KEY_PATH;

if (!firebaseKeyPath || !fs.existsSync(firebaseKeyPath)) {
  throw new Error('❌ Firebase key file not found or FIREBASE_KEY_PATH not set.');
}

const serviceAccount = require(path.resolve(firebaseKeyPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});



module.exports = admin;
