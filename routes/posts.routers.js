import express from 'express'
import {
    getPosts,
    getPost,
    createPost,
    likePost,
    deletePost,
    getPostsByTag,
} from '../controllers/posts.controllers.js'
import {
    getComments,
    createComment,
    deleteComment,
} from '../controllers/comments.controllers.js'
import auth from '../middleware/auth.middleware.js'

const router = express.Router()

//posts
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/tags/:tag', getPostsByTag)

router.post('/', auth, createPost)
router.patch('/:id/likePost', auth, likePost)
router.delete('/:id', auth, deletePost)

//comments
router.get('/:id/comments', getComments)

router.post('/:id', auth, createComment)
router.patch('/:id/comments/:commentId', auth, deleteComment)

export default router
