import Post from '../models/Post.js'
import User from '../models/User.js'
import mongoose from 'mongoose'

import { DEFAULT_PIC } from '../config/config.js'

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        const newPosts = []
        posts.map((post) => {
            const { comments, ...newPost } = post
            newPosts.push(newPost)
        })

        res.status(200).json({ posts: newPosts })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: 'No posts' })
    }
}

export const getPost = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No post with id: ${id}`)

        const post = await Post.findById(id)
        const username = post.username
        const user = await User.findOne({ username })

        let profilePic = user.profilePic
        if (!profilePic) profilePic = DEFAULT_PIC

        // const users = [
        //   ...new Set(post.comments.map((comment) => comment.username)),
        // ];

        // // temporary solution to get user images for every comment
        // let profilePics = await Promise.all(
        //   users.map(async (username) => {
        //     const commentator = username;
        //     const user = await User.findOne({ username });
        //     let image = user.profilePic;
        //     if (!image) image = DEFAULT_PIC;
        //     return { commentator, image };
        //   })
        // );

        // temporary workaround as comments are stored from oldest to newest in the database
        post.comments.reverse()
        res.status(200).json({ post, profilePic })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal server error. Please try again later',
        })
    }
}

export const getPostsByTag = async (req, res) => {
    try {
        const { tag } = req.params
        const posts = await Post.find({ tags: tag }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: `No posts with tag ${tag}` })
    }
}

export const createPost = async (req, res) => {
    const post = req.body
    const newPost = new Post({
        ...post,
        username: req.username,
        user: req.userId,
        crearedAt: new Date().toISOString(),
    })
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error })
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params
    const username = req.username

    if (!req.userId) {
        return res.json({ message: 'Unauthenticated' })
    }

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`)

    const post = await Post.findById(id)

    if (post.likes.find((like) => like.username === username)) {
        // Post already liked, unlike it
        post.likeCount = post.likeCount - 1
        post.likes = post.likes.filter((like) => like.username !== username)
    } else {
        // Not liked, like post
        post.likes.push({
            username,
            createdAt: new Date().toISOString(),
        })
        post.likeCount = post.likeCount + 1
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })
    res.status(200).json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send(`No post with id: ${id}`)

    await Post.findByIdAndRemove(id)

    res.status(200).json({ message: 'Post deleted successfully.' })
}
