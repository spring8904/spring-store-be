import { Router } from 'express'
import { getCurrentUser, login, register } from '../controllers/auth'
import { authMiddleware } from '../middlewares/auth'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.get('/current-user', authMiddleware, getCurrentUser)

export default authRouter
