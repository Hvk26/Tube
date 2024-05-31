import dotenv from "dotenv"
import connectDB from "./db/index.js"


//dotenv configuration
dotenv.config({
    path: "./env"
});

connectDB()
//promise verification for debugging purpose and it is considered as industry standard practice
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