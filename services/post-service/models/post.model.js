import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
    },
    {
        timestamps: true,
        _id: true,
    }
);

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        authorName: {
            type: String,
            required: true,
            trim: true,
        },

        caption: {
            type: String,
            trim: true,
            maxlength: 2200,
            default: "",
        },

        media: [
            {
                url: {
                    type: String,
                    required: true,
                    trim: true,
                },

                fileId: {
                    type: String,
                    trim: true,
                },

                type: {
                    type: String,
                    enum: ["image", "video"],
                    default: "image",
                },
            },
        ],

        likes: {
            type: [String],
            default: [],
        },
        dislikes: {
            type: [String],
            default: [],
        },

        comments: {
            type: [commentSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;