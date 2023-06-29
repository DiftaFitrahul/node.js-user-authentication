import mongoose from "mongoose";
import ENV from "../config.js";

async function connect(){
    try {
        mongoose.set('strictQuery', true)
        const db = await mongoose.connect(ENV.MONGODB_URI);
        console.log("Connect to MongoDB...");
        return db;
    } catch(e) {
        console.log(`Error connecting to MongoDB : ${e.message}`);
    }
}

export default connect;