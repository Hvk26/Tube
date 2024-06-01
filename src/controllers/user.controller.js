import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "./ApiError.js"

const registerUser = asyncHandler(async (req, res)=>{
    // 1. take input from the frontend using a form
    // 2. validation - not empty
    // 3. check if user already exist: userName or email
    // 4. check for images and avatar
    // 5. upload images on cloudinary and check for the url
    // 6. remove password and refresh token fields from frontend
    // 7. check for user creation
    // 8. return response


    const {username, email, fullname, password} = req.body;
    console.log("username: ", username);
    console.log("fullname: ", fullname);
    console.log("email: ", email);
    console.log("password: ", password);

    // Here one can use simple switch or if else case to check for the empty fields
    if([username, email, fullname, password].some((fields)=>fields?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }
})

export {registerUser};