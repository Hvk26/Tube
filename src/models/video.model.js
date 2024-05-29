import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    videoFile:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    views:{
        type: Number,
        default: true
    },
    isPublished:{
        type: boolean,
        default: true
    },
    duration:{
        type: Number,

    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
}, {timestamps: true});

mongoose.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);