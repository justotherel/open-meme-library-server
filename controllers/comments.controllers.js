import Post from '../models/Post.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

import { DEFAULT_PIC } from '../config/config.js'

export const getComments = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${id}`)

        const post = await Post.findById(id)
        const comments = post.comments
        const users = [
            ...new Set(post.comments.map((comment) => comment.username)),
        ]

        let profilePics = await Promise.all(
            users.map(async (username) => {
                const commentator = username
                const user = await User.findOne({ username })
                let image = user.profilePic
                if (!image) image = DEFAULT_PIC
                return { commentator, image }
            }),
        )

        // temporary workaround as comments are stored from oldest to newest in the database
        post.comments.reverse()

        res.status(200).json({ comments, profilePics })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error. Please try again later',
        })
    }
}

export const createComment = async (req, res) => {
    try {
        const comment = req.body
        const { id } = req.params

        if (comment.body.trim === '') {
            return res.status(400).send('Empty comment body')
        }

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${id}`)

        const post = await Post.findById(id)

        post.comments.unshift({
            body: comment.body,
            username: comment.username,
            createdAt: new Date().toISOString(),
        })
        post.commentsCount = post.commentsCount + 1

        await post.save()
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({ message: error })
        console.log(error)
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${id}`)

        let post = await Post.findById(id)
        let comments = post.comments
        const comment = comments.find((comment) => comment._id == commentId)

        if (!comment) res.status(404).send(`No comment with id: ${id}`)

        comments = comments.filter((comment) => comment._id != commentId)

        post.commentsCount = post.commentsCount - 1
        post.comments = comments

        const updatedPost = await Post.findByIdAndUpdate(id, post, {
            new: true,
        })
        res.status(200).json(updatedPost)
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal sevrer eror, please try again later')
    }
}
