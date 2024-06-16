import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const video = await Video.aggregatePaginate(query, {
        limit: parseInt(limit),
        page: parseInt(page),
        sort : {
            [sortBy]: sortType
        },
        userId: isValidObjectId(userId) ? userId : null
    });

    if(!video){
        throw new ApiError(404, "Videos not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, {video: video}, "Video fetched successfully"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body;
    // TODO: get video, upload to cloudinary, create video

    if([title, description].some((field)=>field.trim()=== "")){
        throw new ApiError(400, "All fields are required");
    }

    const videoLocalPath = req.files?.videoFile[0].path;

    const thumbnailLocalPath = req.files?.thumbnail[0].path

    if(!videoLocalPath && !thumbnailLocalPath){
        throw new ApiError(400, "Video or thumbnail path is not valid");
    }

    const video = await uploadOnCloudinary(videoLocalPath);

    if(!video){
        throw new ApiError(500,"There was an error uploading video")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail){
        throw new ApiError(500,"There was an error uploading thumbnail")
    }

    const newVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        owner: req.user._id
    })

    const publishedVideo = await Video.findById(newVideo._id);

    if(!publishedVideo){
        throw new ApiError(404, "Video not found")
    }

    return res.status(200)
    .json(new ApiResponse(200, publishedVideo, "Video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!videoId?.trim()){
        throw new ApiError(404, "Error finding the video")
    }

    const video =  await Video.findById(videoId.trim());

    if(!video){
        throw new ApiError(404, "Video is not available")
    }

    return res.status(200)
    .json(new ApiResponse(200, {video}, "Video found successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

    const {title, description} = req.body;

    if([title, description].some((field)=>field.trim()=== "")){
        throw new ApiError(400, "All fields are required");
    }

    const thumbnailLocalPath = req.files?.thumbnail[0].path;

    if(!thumbnailLocalPath){
        throw new ApiError(404, "Thumbnail local path is required");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const video = await Video.findByIdAndUpdate(videoId,{
        $set:{
            title: title,
            description: description,
            thumbnail: thumbnail.url
        }
    },
        {
            new:true
        }
    )

    return res.status(200)
    .json(new ApiResponse(200, video, "Video details updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id");
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
