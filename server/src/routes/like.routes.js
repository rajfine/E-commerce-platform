import express from 'express'
import { authenticateUser } from '../middleware/auth.middleware.js'
import { getLikes, toggleLike } from '../controllers/like.controller.js'

const router = express.Router()

router.get('/', authenticateUser, getLikes)
router.post('/toggle', authenticateUser, toggleLike)

export default router
