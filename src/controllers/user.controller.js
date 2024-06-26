import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return{accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "failed to generate access and refresh tokens");
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    // 1. take input from the frontend using a form
    // 2. validation - not empty
    // 3. check if user already exist: userName or email
    // 4. check for images and avatar
    // 5. upload images on cloudinary and check for the url
    // 6. remove password and refresh token fields from frontend
    // 7. check for user creation
    // 8. return response

    // console.log(req.body);

    const {username, email, fullname, password} = req.body;
    // console.log("username: ", username);
    // console.log("fullname: ", fullname);
    // console.log("email: ", email);
    // console.log("password: ", password);

    // Here one can use simple switch or if else case to check for the empty fields
    if([username, email, fullname, password].some((fields)=>fields?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or:[{username}, {email}]
    });

    if(existedUser){
        throw new ApiError(409, "User already exists");
    }

    console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //using classic if else statement to check the cover image local path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar image is required");
    }

    const user = await User.create({
        email,
        username: username.toLowerCase(),
        fullname,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User successfully registered")
    );
});

const loginUser = asyncHandler(async (req, res)=> {
    // take input from the frontend
    // validation for empty field
    // validation of exisisting user in database after decrypting the data i.e. checking the password
    // send access and refresh tokens
    // send cookies
    // take user to the dashboard


    const {username, email, password} = req.body;

    if(!(username || password)){
        throw new ApiError(400, "username or email required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options ={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully")
    )
});

const logoutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(
        200, {}, "User logged out"
    ));
});

const refreshAccessToken = asyncHandler(async (req, res)=> {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }


        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        return res
               .status(200)
               .cookie("accessToken", accessToken, options)
               .cookie("refreshToken", newRefreshToken, options)
               .json(
                new ApiResponse(200, {accessToken, refreshToken: newRefreshToken, }, "Access token refreshed")
               )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const {oldPassword, newPassword, confirmPassword} = req.body;

    if(!(oldPassword === confirmPassword)){
        throw new ApiError(400, "Password does not match");
    }

    const user =  await User.findById(user.req?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Password invalid");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
           .status(200)
           .json(new ApiResponse(200, {}, "Password changed succesfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    
    const {fullname, email} = req.body;

    if(!fullname || !email){
        throw new ApiError(400, "please fill the mandatory fields");
    }

    const user = await User.findByIdAndUpdate(
        user.req?._id,
        {
            $set:{
                fullname,
                email
            }
        },
        {
            new: true
        }
    ).select("-password");
    
    
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateAvatarImage = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar image not found");
    }

    const avatar =  await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "error while uploading avatar image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar image updated successfully"));

});

const updateCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "cover image not found");
    }

    const coverImage =  await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url){coverImageLocalPath
        throw new ApiError(400, "error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200, user, "cover image updated successfully"));

});

const getUserChannelProfile = asyncHandler(async (req, res)=> {

    const {username} = req.params;

    if(!username?.trim()){
        throw new ApiError(400, "User not found")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size: "$subscribers"
                },
                channelSubscriberedToCount:{
                    $size: "$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscriberedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,           
            }
        }

    ]);

    if(!channel?.length){
        throw new ApiError(404, "Channel does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channel[0]), "User channel fetched succesfully");
});

const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline:[{
                    $lookup:{
                        from:"users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline:[
                            {
                                $project:{
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields:{
                        owner:{
                            $first: "$owner"
                        }
                    }
                }
            ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user.watchHistory,
        "Watch history fetched successfully"
    ))
});
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatarImage,
    updateCoverImage,
    getUserChannelProfile,
    getWatchHistory
};