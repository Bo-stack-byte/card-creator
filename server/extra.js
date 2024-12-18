
const express = require('express');
var path = require('path');


module.exports = (app) => {
    app.use('/card-creator', express.static(path.join(__dirname, 'build-cc')));

    app.get('/card-creator/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build-cc/index.html'));
    });
    const bodyParser = require('body-parser');
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