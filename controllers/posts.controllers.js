import Post from "../models/Post.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({createdAt:-1})
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: "No posts" })
  }
};

export const getPost = async (req, res) => {
  try {
    const id = req.headers.referer?.split('/')[4]

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`)

    const post = await Post.findById(id)
    // temporary workaround as comments are stored from oldest to newest in the database
    post.comments.reverse()
    
    res.status(200).json(post)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error. Please try again later'})
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const {tag} = req.params
    const posts = await Post.find({tags: tag}).sort({createdAt:-1})
    res.status(200).json(posts);

  } catch (error) {
    console.log(error)
    res.status(404).json({ message: `No posts with tag ${tag}` })
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new Post({
    ...post,
    username: req.username,
    user: req.userId,
    crearedAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error })
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  const username = req.username;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" })
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`)

  const post = await Post.findById(id);

  if (post.likes.find((like) => like.username === username)) {
    // Post already liked, unlike it
    post.likeCount = post.likeCount - 1;
    post.likes = post.likes.filter((like) => like.username !== username)
  } else {
    // Not liked, like post
    post.likes.push({
      username,
      createdAt: new Date().toISOString(),
    });
    post.likeCount = post.likeCount + 1;
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`)

  await Post.findByIdAndRemove(id)

  res.json({ message: "Post deleted successfully." })
};

export const createComment = async (req, res) => {
  try {
    const comment = req.body

    // Quite hacky solution. When deploying the url may change 
    const id = req.headers.referer?.split('/')[4]

    if (comment.body.trim === "") {
      return res.status(400).send("Empty comment body");
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`)

    const post = await Post.findById(id);

    post.comments.unshift({
      body: comment.body,
      username: comment.username,
      createdAt: new Date().toISOString(),
    });
    post.commentsCount = post.commentsCount + 1

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(409).json({ message: error })
    console.log(error);
  }
};

export const deleteComment = async (req, res) => {

}
