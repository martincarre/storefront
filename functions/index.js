const fs = require('fs');
const {logger} = require("firebase-functions");
const { onRequest } = require('firebase-functions/v2/https');

const { initializeApp, cert, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { log } = require('firebase-functions/logger');

// Firebase Admin SDK initialization
// Check if running on Firebase Emulators
if (process.env.FUNCTIONS_EMULATOR) {
    // Local development, use service account credentials in env file
    log(`Running on Firebase Emulators`);
    const serviceAccountFile = fs.readFileSync('./environment/maps-prospect-searcher-ec5af9144f41.json');
    const serviceAccount = JSON.parse(serviceAccountFile);

    initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    // Production, use Application Default Credentials
    initializeApp({
        credential: applicationDefault(),
    });
}

// HTTP-triggered Google Cloud Function (onRequest)
exports.signup = onRequest( async (req, res) => {
    const {
      email,
      password,
      confirmPassword,
      name,
      role,
      useCase,
      businessWebsite,
      businessName,
      businessType
    } = req.body;
  
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }
  
    try {
      // Step 1: Create the user in Firebase getAuth()
      const userRecord = await getAuth().createUser({
        email: email,
        password: password,
        displayName: name,
      });
      const uid = userRecord.uid;
      logger.info(`User created with UID: ${uid}`);
  
      // Step 2: Set custom claims (role: 'user')
      await getAuth().setCustomUserClaims(uid, { role: 'user' });
      logger.info(`Custom claims set for UID: ${uid}`);
  
      // Step 3: Create a Firestore document with UID as document ID
      await getFirestore().collection('users').doc(uid).set({
        email: email,
        name: name,
        role: role,  // Store role for easy querying
        useCase: useCase,
        businessWebsite: businessWebsite,
        businessName: businessName,
        businessType: businessType
      });
      logger.info(`User document created in Firestore with UID: ${uid}`);
  
      // Return success response
      return res.status(201).json({
        success: true,
        uid: uid,
        message: `The user ${email} was successfully created.`,
      });
    } catch (error) {
      logger.error('Error during user signup:', error);
  
      // Rollback: If Firestore creation fails, delete user from Firebase getAuth()
      if (error.message.includes('Firestore')) {
        logger.info('Rolling back user creation in Firebase getAuth().');
        try {
          const userRecord = await getAuth().getUserByEmail(email);
          if (userRecord) {
            await getAuth().deleteUser(userRecord.uid);
            logger.info(`User with UID: ${userRecord.uid} deleted from Firebase getAuth().`);
          }
        } catch (getAuthError) {
          logger.error('Failed to delete user during rollback:', getAuthError);
        }
      }
  
      // Return error response
      return res.status(500).json({
        success: false,
        message: 'An error occurred during user signup. Please try again.',
        error: error.message,
      });
    }
  });