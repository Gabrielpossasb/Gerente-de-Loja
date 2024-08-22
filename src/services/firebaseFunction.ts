const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkVideoID = functions.https.onCall(async (data: { videoID: string }) => {
  const videoID = data.videoID;

  const videoRef = admin.firestore().collection('treinamento').doc(videoID);
  const doc = await videoRef.get();

  if (doc.exists) {
    // O UUID já existe
    return { exists: true };
  } else {
    // O UUID é único
    return { exists: false };
  }
});
