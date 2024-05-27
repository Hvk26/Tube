import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async ()=>{ // here we are using async await for the connection because database is far away so it takes time to get response back from database.
        try {
            const connectionInstance = await mongoose.connect(`${process.env.MONGOO_URI}/${DB_NAME}`); // this is being used to connect to the mongo server
            console.log(" mongoDB connection host at: " + connectionInstance.connection.host);
        } catch (error) {
            console.log("MongoDB connection failed:" + error);
            process.exit(1);
    } 
}


export default connectDB;