const fs = require('fs');
const { initializeApp, cert, applicationDefault } = require("firebase-admin/app");
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

// Auth related functions
exports.signup = require('./src/signup');

// Blog related functions
const { fetchBlogPosts, fetchBlogPostById } = require('./src/blog');
exports.fetchBlogPosts = fetchBlogPosts;
exports.fetchBlogPostById = fetchBlogPostById;