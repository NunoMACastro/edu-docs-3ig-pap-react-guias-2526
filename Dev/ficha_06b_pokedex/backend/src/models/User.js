import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        favorites: {
            type: [Number],
            default: [],
        },
        avatarUrl: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.passwordHash;
                return ret;
            },
        },
    },
);

const User = mongoose.model("User", userSchema);

export default User;
