import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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

    const existedUser =  User.findOne({
        $or:[{username}, {email}]
    });

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const converImageLocalPath = req.files?.converImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }
    
    const avatar = uploadOnCloudinary(avatarLocalPath);
    const converImage = uploadOnCloudinary(converImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar image is required");
    }

    const user = await User.create({
        email,
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar: avatar.url,
        converImage: converImage?.url || ""
    });
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!checkUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User successfully registered")
    );
});

export {registerUser};