
const express = require('express');
var path = require('path');

const magic_path = './plugins/creator/node_modules/'

console.log("extra js");
console.error("EXTRA JS 123123");
module.exports = (app) => {
    console.error("EXTRA JS 123123 456456 456456");

    // MAIN SITE
    app.use('/card-creator', express.static(path.join(__dirname, 'build-cc')));
    app.get('/card-creator/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build-cc/index.html'));
    });

    //const bodyParser = require('body-parser');

    // SAVE/RETRIEVE CARDS W/MONGO
    const connectDB = require('./db');
    function generateKey(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            key += characters[randomIndex];
        }
        return key;
    }

    app.post('/api/save', async (req, res) => {
        let session;
        try {
            const { client, db } = await connectDB();
            const collection = db.collection('artworks');
            let session = client.startSession();
            session.startTransaction();

            const document = { ...req.body };
            if (!document.referenceId) document.referenceId = generateKey(6);
            let key = document.referenceId;

            const existingDocs = await collection.find({ referenceId: key }).sort({ revision: -1 }).limit(1).toArray();
            let newRevision = existingDocs.length > 0 ? existingDocs[0].revision + 1 : 1;

            document.revision = newRevision;
            const result = await collection.insertOne(document, { session });
            const referenceId = result.insertedId;

            await session.commitTransaction();
            session.endSession();

            res.status(201).send({ referenceId: key, versionId: newRevision });
        } catch (err) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            console.error('Error:', err);
            res.status(500).send({ error: 'Failed to save data' });
        }
    });
    app.get('/api/bob', async (req, res) => {
        res.status(500).send({ error: 'Failed to retrieve bob' });

    })

    app.get('/api/data/:id', async (req, res) => {
        // console.error(176, req.params);
        try {
            const args = req.params.id;
            const [ref, s_vid] = args.split(",");
            const { _, db } = await connectDB();
            const collection = db.collection('artworks');
            const n_vid = Number(s_vid);
            let data;
            if (n_vid && n_vid > 0) {
                data = await collection.findOne({ referenceId: ref, revision: n_vid });
            } else {
                data = await collection.findOne({ referenceId: ref });
            }

            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({ error: 'Data not found' });
            }
        } catch (err) {
            console.error(79, err, req);
            res.status(500).send({ error: 'Failed to retrieve data' });
        }
    });

    ///// MONGO END

    //// IMAGE SAVE/RETRIVE W/GOOGLE BUCKET
    const { Storage } = require(magic_path + '@google-cloud/storage');
    const multer = require(magic_path + 'multer');
    const bucketName = process.env.GCS_BUCKET_NAME;
    const { OAuth2Client } = require(magic_path + 'google-auth-library');


    const encoded_credentials = process.env.GOOGLE_CLOUD_CREDENTIALS;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (encoded_credentials && client && bucketName) {
        console.log("bucket " + bucketName);

        const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS, 'base64').toString());
        const storage = new Storage({
            projectId: credentials.project_id,
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
        });

        const detect = require(magic_path + 'detect-file-type');
        const allowedMimeTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/gif']; // Allowed MIME types
        const upload = multer({
            storage: multer.memoryStorage(),
            fileFilter: (req, file, cb) => {
                cb(null, true); // Allow all files initially
            }
        });

        const authenticateToken = async (req, res, next) => {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token || token == null) return res.status(401).send("no auth token");
            try {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                req.user = payload;
                next();
            } catch (error) {
                console.error(error);
                console.error("token was " + token);
                // Handle the error
                if (error.message.includes("Token used too late")) {
                    // Specific handling for expired tokens
                    res.status(401).json({ error: "Token has expired" });
                } else {
                    // Generic error handling
                    res.status(400).json({ error: "Invalid token" });
                }
            }
        };
        console.error("123123 130");

        app.post('/api/image/upload', authenticateToken, upload.single('image'), async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).send('No file uploaded.');
                }

                const { client, db } = await connectDB();
                const collection = db.collection('master-images');
                let session = client.startSession();
                session.startTransaction();

                const image_id = req.body.image_id;
                let find = await collection.findOne({ image_id: image_id });
                if (find) {
                    await session.commitTransaction();
                    session.endSession();
                    return res.status(400).send('Image ID already present.');
                }

                const userId = req.user.sub; // User's unique identifier (openid)
                const folder = req.body.folder; // 'foregrounds' or 'backgrounds'
                const mongo_obj = {
                    image_id: image_id,
                    folder: folder,
                    user_id: userId,
                    client_ip: req.ip,
                    uploaded_at: new Date()
                }
                const result = await collection.insertOne(mongo_obj, { session });

                const fileBuffer = req.file.buffer;
                detect.fromBuffer(fileBuffer, (err, result) => {
                    if (err || !allowedMimeTypes.includes(result.mime)) {
                        return res.status(400).send('Invalid file type. Only JPEG, PNG, GIF, and WebP files are allowed.');
                    }
                    const file = req.file;
                    let originalName = file.originalname || "image";
                    originalName += Math.random();
                    originalName = `img-${image_id}.img`;
                    const destFileName = `${folder}/${originalName}`;

                    const bucket = storage.bucket(bucketName);
                    const blob = bucket.file(destFileName);
                    const blobStream = blob.createWriteStream();

                    blobStream.on('error', (err) => { res.status(500).send(err); return; });
                    blobStream.on('finish', () => {
                        // fall on through.
                        // res.status(200).send('Image uploaded successfully!');
                    });
                    blobStream.end(fileBuffer);

                    const sharp = require(magic_path + "sharp");

                    async function generateThumbnail(inputBuffer) {
                        return await sharp(inputBuffer)
                            .resize({ width: 100, height: 100, fit: "inside" }) // Maintain aspect ratio
                            .toBuffer(); // Returns the resized image as a buffer
                    }

                    let thumbnail = generateThumbnail(fileBuffer);
                    thumbnail.then((thumbBuffer) => {
                        const thumbname = `thumb-${image_id}.img`;
                        const thumbBlob = bucket.file(`${folder}/${thumbname}`);
                        const thumbStream = thumbBlob.createWriteStream();
                        thumbStream.on('error', (err) => { res.status(500).send(err); return; });
                        thumbStream.on('finish', () => {
                            res.status(200).send('Thumbnail uploaded successfully!');
                        });
                        thumbStream.end(thumbBuffer);
                    });

                });

                await session.commitTransaction();
                session.endSession();

                // no nneed to send message

            } catch (error) {
                console.error("Error uploading file:", error);
                res.status(500).send("Error uploading file");
            }
        });
        console.log("pre get signed urls");

        // up to 2 images at the moment
        app.get('/api/image/get-url-by-id', async (req, res) => {
            let url;
            let resp = [];
            try {
                for (let ground of ["foreground", "background"]) {
                    if (url = req.query[ground]) {
                        const prefix = `${ground}s/img-${url}.img`;
                        if (!/^[a-zA-Z0-9-_\/]+$/.test(url)) {
                            throw new Error("Invalid url format.");
                        }
                        console.error(267, prefix);
                        const [files] = await storage.bucket(bucketName).getFiles({ prefix: prefix });
                        await Promise.all(files
                            .filter(file => !file.name.endsWith('/'))
                            .map(async (file) => {
                                const signedUrl = await file.getSignedUrl({
                                    version: 'v4',
                                    action: 'read',
                                    expires: Date.now() + 60 * 60 * 1000, // 1 hour
                                });
                                resp.push({
                                    type: ground,
                                    url: url,
                                    signedUrl: signedUrl
                                });
                            }));
                    }
                }
                res.json(resp);
            } catch (error) {
                console.error("Error generating signed URL:", error);
                res.status(500).send("Error generating signed URL");
            }
        })

        app.get('/api/image/get-signed-urls', async (req, res) => {
            console.error("123123 183....");

            try {
                const folder = req.query.folder; // 'foregrounds' or 'backgrounds'
                if (!/^[a-zA-Z0-9-_\/]+$/.test(folder)) {
                    throw new Error("Invalid prefix format.");
                }
                let [files] = await storage.bucket(bucketName).getFiles({ prefix: `${folder}/img-`, maxResults: 10 });
                const urls = await Promise.all(files
                    .filter(file => !file.name.endsWith('/'))
                    .map(async (file) => {
                        const [url] = await file.getSignedUrl({
                            version: 'v4',
                            action: 'read',
                            expires: Date.now() + 60 * 60 * 1000, // 1 hour
                        });
                        return url;
                    }));
                res.json(urls);
            } catch (error) {
                console.error("Error generating signed URLs:", error);
                res.status(500).send("Error generating signed URLs");
            }
        });
        console.error("123123 203");
    }
    console.error("123123 216");



    //// END GOOGLE PICTURE SERVER


    //// GOOGLE AUTH

    const session = require(magic_path + 'express-session');
    const passport = require(magic_path + 'passport');
    const pgo = require(magic_path + 'passport-google-oauth20');
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;



    if (client && client_secret && session && passport && pgo) {
        const GoogleStrategy = require(magic_path + 'passport-google-oauth20').Strategy;

        // Configure Passport to use Google OAuth 2.0
        passport.use(new GoogleStrategy({
            clientID: client,
            clientSecret: client_secret,
            callbackURL: '/auth/google/callback'
        },
            (accessToken, refreshToken, profile, done) => {
                return done(null, profile.id);
            }));

        console.error("123123 237");

        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((id, done) => {
            done(null, id);
        });

        app.use(session({
            secret: 'aaaaaaaa',
            resave: false,
            saveUninitialized: false,
            // cookie: { secure: false } // Set to true if using HTTPS
        }));

        app.use(session({}));
        app.use(passport.initialize());
        app.use(passport.session());

        // Start the Google OAuth 2.0 login
        app.get('/auth/google',
            passport.authenticate('google', { scope: ['profile'] })
        );
        // Callback route
        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                // Successful authentication, redirect to your desired route
                res.redirect('/dashboard');
            }
        );

        // is this used?
        app.get('/api/current_user', (req, res) => {
            res.send(req.user);
        });
    }

    // script to autogenerate images
    //const puppeteer = require('puppeteer');
    //const fs = require('fs');
    if (false)
        app.use('/generate-image', async (req, res) => {
            try {
                const { share } = req.query;
                const protocol = req.protocol;
                const host = req.get('host');
                console.error(2);
                console.error(share);
                console.error(1111);
                // Launch Puppeteer
                //    const browser = await puppeteer.launch({ args: ['--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'] });
                const page = await browser.newPage();
                await page.setViewport({ width: 4000, height: 3080, deviceScaleFactor: 4 }); // Set viewport size to 1920x1080

                page.on('request', request => console.error('Request:', request.url()));
                page.on('response', response => console.error('Response:', response.url()));

                // Listen for console messages
                page.on('console', msg => {
                    for (let i = 0; i < msg.args().length; ++i)
                        console.error(`${msg.type()}: ${msg.args()[i]}`);
                });
                // 
                const url = `${protocol}://${host}/card-creator/?share=${encodeURIComponent(share)}`;

                //let url = "/card-creator/?share=eJx9UstOGzEU3fcrjmbTBUma0FKJ7iBhRyvE0BY0nYUzc5Ox8Ngj2zMkivgT1C_hn_gFbM-jpIrwyvc8rs-1Dew-wK0oYzq_2VYUfUP0XUljSUejlpKs9PDObUmuBTeFF8UFJ5EjLpkpnBZ4HP3rdNl4yWUz-Rq9QX_U5dJJHTOPj8ez2cApoQJ8Lmr6dE15T1SCbefKWM_NjnuUGiUamiuZc8uVdGTAgWT3X69o5IHW_8UXghoSvjqJ-rxuvbWF099zIe1i5JWHTqfT6RBstaIs2F6en34pbWnz8vwXrogpqzW3W5xZy7J7HM08kdypWuOm1jLF74IkbMENyvb2wYLUgKF7DzxwWyBpLz4Fl-DWwL_OqHX2ujU5_OjEJcPiCrW0XDgBgWQOtcLWn6qqSkmS9qOBdQEmf2TSh0yRnAkRcpkUIWPX2fjWLnzbebL_IBfD9OOeMF3HQ1RFGWfiIlj3GDe35svaBnTBLOuJldKlx34Ky0vm-A633beNH5Qevk7O1_xWK-OJZNEVGH_2w20I14znpFNskFzxe5YVdTo4JdtP1cXKDk24rLWxB4bQzM8dPhTTFDnw8RVnUP5c"
                console.error("55");
                if (!/^[-_a-zA-Z0-9]+$/.test(share)) {

                    return res.status(400).send("Invalid magic parameter " + share);

                }
                console.error(url);
                // url = "http://loc
                //  await page.goto("http://localhost:3001" + url);

                await page.goto(url, { waitUntil: 'networkidle0' });
                console.error("57");

                let imageBuffer;

                if (false) {
                    // Wait for 10 seconds
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    const element = await page.$('#cardImage');
                    console.error("70");

                    // Capture the entire page
                    //    imageBuffer = await page.screenshot({ fullPage: true });
                    imageBuffer = await element.screenshot();

                } else {

                    // Wait for the canvas element to be rendered
                    await page.waitForSelector('#cardImage');
                    console.error("62");

                    // Get the canvas element and capture it
                    const element = await page.$('#cardImage');
                    console.error("66");

                    imageBuffer = await element.screenshot();
                }
                // we need to use unique temp files here
                fs.writeFileSync('tempImage.png', imageBuffer);

                await browser.close();
                console.error("84");
                // Send the image file
                res.sendFile('tempImage.png', { root: __dirname }, (err) => {
                    if (err) {
                        res.status(500).send("send file error " + err);
                    }
                    fs.unlinkSync('tempImage.png');
                });
            } catch (e) {
                console.error(e);
                res.status(500).send("exception error " + e);
            }
        });

}
