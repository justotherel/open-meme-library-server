import express from 'express'
import {getPosts, getPost, createPost, likePost, deletePost, createComment, deleteComment, getPostsByTag} from '../controllers/posts.controllers.js'
import auth from '../middleware/auth.middleware.js'

const router  = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/tags/:tag', getPostsByTag)
router.post('/', auth, createPost)
router.patch('/:id/likePost', auth, likePost);
router.delete('/:id', auth, deletePost);
router.post('/:id', auth, createComment)
router.delete('/:id', auth, deleteComment)

export default router