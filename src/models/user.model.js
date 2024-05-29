import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
},{timestamps:true});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password);
    next();
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}


export const User = mongoose.model("User", userSchema);