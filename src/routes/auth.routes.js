import { Router } from 'express'
import {
  getCurrentUser,
  login,
  logout,
  register,
} from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/logout', authMiddleware, logout)
authRouter.post('/register', register)
authRouter.get('/me', authMiddleware, getCurrentUser)

export default authRouter
