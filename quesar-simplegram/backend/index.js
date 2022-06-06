/*
  dependencies
 */

const express = require('express')
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require('firebase-admin/storage')
const path = require('path')
const os = require('os')
const fs = require('fs')
const UUID = require('uuid-v4')

const busboy = require('busboy')

/*
  config -express
 */

const app = express()

/*
  Firebase - config
*/

const serviceAccount = require('./serviceAccountKey.json')

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'quasar-simplegram.appspot.com'
});

const db = getFirestore();
const bucket = getStorage().bucket();

/*
  endpoint - posts
 */

app.get('/posts', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')

  const posts = []

  const snapshot = await db.collection('posts')
    .orderBy('date', 'desc')
    .get();
  snapshot.forEach((doc) => {
    posts.push(doc.data())
  })

  // eslint-disable-next-line no-console
  console.log('posts =>', posts);

  response.send(posts)
})

/*
  endpoint - createPost
 */

app.post('/createPost', async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*')

  const uuid = UUID();

  const bb = busboy({headers: request.headers})

  const fields = {}
  let fileData = {}

  bb.on('file', (name, file, info) => {
    const {filename, encoding, mimeType} = info;
    console.log(
      `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
      filename,
      encoding,
      mimeType
    );
    // /tmp/2323234-2343242.png

    const filepath = path.join(os.tmpdir(), filename)
    file.pipe(fs.createWriteStream(filepath))

    fileData = { filepath, mimeType }
  });

  bb.on('field', (name, val, info) => {
    fields[name] = val;
  });

  bb.on('close', async () => {

    await bucket.upload(
      fileData.filepath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimeType,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile)
        }
      }
    )

    async function createDocument(uploadedFile) {
      await db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`
      })

      response.send('Post added: ' + fields.id);
    }
  });

  request.pipe(bb);
})

/*
  listen
 */
app.listen(process.env.PORT || 3001)
