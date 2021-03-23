import express from 'express'
import {getPostsByTag} from '../controllers/tags.controllers.js'
import auth from '../middleware/auth.middleware.js'

const router  = express.Router()

router.get('/:tag', getPostsByTag)


export default router