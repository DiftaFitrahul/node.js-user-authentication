import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect(){
    try {
        const mongod = await MongoMemoryServer.create();
        const getUri = mongod.getUri();

        mongoose.set('strictQuery', true)
        const db = mongoose.connect(getUri);
        console.log("Connect to MongoDB...");
        return db;
    } catch(e) {
        console.log(`Error connecting to MongoDB : ${e.message}`);
    }
}

export default connect;