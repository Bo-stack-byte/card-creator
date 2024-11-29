const { MongoClient } = require('mongodb');

const uri = process.env.ATLAS_CONNECT;
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
