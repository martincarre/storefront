const {logger} = require("firebase-functions");
const { onRequest } = require('firebase-functions/v2/https');
const { getFirestore } = require("firebase-admin/firestore");

fetchBlogPosts = onRequest( async (req, res) => {
    const snapshot = await getFirestore().collection('articles').get();
    const posts = snapshot.docs.map(doc => doc.data());
    logger.info(`Success! Found ${posts.length} articles in db.`);
    return res.status(200).json({ 
        success: true,
        message: `Found ${posts.length} articles.`,
        data: posts.length > 0 ? posts : [],
    });
});

fetchBlogPostById = onRequest( async (req, res) => {
    const id = req.query.id;
    const snapshot = await getFirestore().collection('articles').doc(id).get();
    let post = null;
    let message = '';
    if (snapshot.exists) {
        logger.info(`Success! Found article with ID: ${id}`);
        message = `Found article with ID: ${id}`;
        post = { id: snapshot.id ,  ...snapshot.data() };
    }
    else {
        message = `Article with ID: ${id} not found.`;
        logger.warn(`Article with ID: ${id} not found.`);
    }
    return res.status(200).json({
        success: true,
        message: message,
        data: post,
    });
});

module.exports = { 
    fetchBlogPosts,
    fetchBlogPostById
}