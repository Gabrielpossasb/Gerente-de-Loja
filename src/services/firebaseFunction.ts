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

// const ffmpeg = require('fluent-ffmpeg');
// const { Storage: GoogleCloudStorage } = require('@google-cloud/storage');
// const path = require('path');
// const os = require('os');
// const fs = require('fs');

// const storage = new GoogleCloudStorage();

// exports.generateVideoThumbnail = functions.https.onCall(async (data: { videoPath: string }) => {
// 	const videoPath = data.videoPath;
// 	const bucketName = functions.config().firebase.storageBucket; // Nome do bucket do Firebase Storage
// 	const bucket = storage.bucket(bucketName);
// 	const fileName = path.basename(videoPath);
// 	const tempFilePath = path.join(os.tmpdir(), fileName); // Local temporário para baixar o vídeo
// 	const tempThumbPath = path.join(os.tmpdir(), `thumb_${fileName}.png`); // Caminho para salvar a miniatura temporária

// 	// Baixar o vídeo do Firebase Storage para o sistema temporário local
// 	await bucket.file(videoPath).download({ destination: tempFilePath });

// 	// Retorna uma promise que será resolvida quando a miniatura for criada
// 	return new Promise<void>((resolve, reject) => {
// 		 ffmpeg(tempFilePath)
// 			  .on('end', async () => {
// 					try {
// 						 // Faz o upload da miniatura gerada para o bucket Firebase Storage
// 						 await bucket.upload(tempThumbPath, {
// 							  destination: `thumbs/${fileName}.png`,
// 						 });

// 						 // Remove os arquivos temporários
// 						 fs.unlinkSync(tempFilePath);
// 						 fs.unlinkSync(tempThumbPath);

// 						 resolve();
// 					} catch (error) {
// 						 console.error('Erro ao fazer upload da miniatura:', error);
// 						 reject(error);
// 					}
// 			  })
// 			  .on('error', (err: any) => {
// 					console.error('Erro ao gerar miniatura:', err);
// 					reject(err);
// 			  })
// 			  .screenshots({
// 					count: 1, // Número de miniaturas que deseja gerar (1 neste caso)
// 					folder: os.tmpdir(), // Local temporário para armazenar a miniatura
// 					filename: `thumb_${fileName}.png`, // Nome do arquivo da miniatura
// 					size: '320x240', // Tamanho da miniatura
// 			  });
// 	});
// });