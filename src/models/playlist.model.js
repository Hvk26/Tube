import mongoose from "mongoose";

const playlistSchema = new Schema({
    video:[{
        type: mongoose.Types.ObjectId,
        ref: "Video"
    }],
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true});

export const Playlist = mongoose.model("Playlist", playlistSchema);