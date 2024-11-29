const { MongoClient } = require('mongodb');

const username = process.env.ATLAS_USERNAME;
const password = process.env.ATLAS_PASSWORD;
const server = process.env.ATLAS_SERVER;
const app_name = process.env.APP_NAME;

const uri = `mongodb+srv://${username}:${password}@${server}/?retryWrites=true&w=majority&appName=${app_name}`
const client = new MongoClient(uri);

let db;


async function connectDB() {
    if (db) return db;
    await client.connect();

   // await client.db("admin").command({ ping: 1 });
   // console.error(14, "Pinged your deployment. You successfully connected to MongoDB!");
    
    db = client.db('saved-cards');
    return db;
}

module.exports = connectDB;
