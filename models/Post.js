import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    description: String,
    tags: [String],
    image: String,
    username: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    comments: [
        {
            body: String,
            username: String,
            createdAt: {
                type: Date,
                default: new Date(),
            },
        },
    ],
    likes: [
        {
            username: String,
            createdAt: String,
        },
    ],
    likeCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
})

const Post = mongoose.model('Post', postSchema)

export default Post
