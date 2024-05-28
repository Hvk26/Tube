import mongoose, {Schema} from mongoose;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        required: true,
        index: true
    },
    avatar:{
        type: String, // it will contain a cloud URL
        required: true
    },
    coverImage:{
        type: String // it will contain a cloud URL
    },
    watchHistory:[
        {
            type:Schema.Types.objectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        requires:[true, "password is required"]
    },
    refreshToken:{
        type: String
    }
});

export const User = mongoose.model("User", userSchema);