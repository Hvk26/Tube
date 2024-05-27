import dotenv from "dotenv"
import connectDB from "./db/index.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // cookie-parser is some kind of middleware it is used to get certain kind of permission

const app = express();


//dotenv configuration
dotenv.config({
    path: "./env"
});

//CORS configuration (app.use is used for all kind of configuration in express)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // this is the origin link that is taken from environment variables
    credentials: true // this is to make the credentials true
}));

//express configuration
app.use(express.json({limit: "16kb"})); // to limit the amount of JSON request to server
app.use(express.urlencoded({extended: true, limit:"16kb"})); // to make the server request from differnt URLs uniform (extended means that we can add objects inside of objects)
app.use(express.static("public")); // to store some data from users into local public folder

//cookie-parser configuration
app.use(cookieParser());

connectDB()
//promise verification for debugging purpose
.then(()=>{

    app.on("error", ()=>{
        console.log(`Error: ${error}`);
    })

    app.listen(process.env.PORT || 4000, ()=>{
        console.log(`App is running on PORT:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Connection to MongoDB failed", err);
})





















// import express from "express";
// const app = express();
// ;(async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGOO_URI}/${DB_NAME}`);
        
//         app.on("error", ()=>{
//             console.log("Error:" + error);
//         });

//         app.listen(process.env.PORT, ()=>{
//             console.log("App is running");
//         })
//     } catch (error) {
//         console.log("ERROR:" + error);
//     }
// })()