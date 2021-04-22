import express from 'express'
import {getProfile, editProfile} from '../controllers/profiles.controlles.js'
import auth from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/:user', getProfile)
router.post('/:user/edit', auth, editProfile)

export default router
