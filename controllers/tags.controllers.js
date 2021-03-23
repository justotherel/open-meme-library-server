import Post from "../models/Post.js";

export const getPostsByTag = async (req, res) => {
  try {
    const {tag} = req.headers.referer?.split('/')[4];
    const posts = await Post.find(tag);
    res.status(200).json(posts);

  } catch (error) {
    console.log(error)
    res.status(404).json({ message: `No posts with tag ${tag}` });
  }
};