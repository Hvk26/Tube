import mongoose from "mongoose";
import { DB_NAME } from "./constants";





















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