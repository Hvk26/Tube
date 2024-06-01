import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser" // cookie-parser is a kind of middleware it is used to get certain kind of permission

const app = express();

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


//importing routes
import userRouter from "./routes/user.routes.js";





//declaring routes
app.use("/user", userRouter);

export {app};