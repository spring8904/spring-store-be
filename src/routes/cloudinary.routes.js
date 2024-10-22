import { Router } from 'express'
import { deleteImages } from '../controllers/cloudinary.controller'
import { authMiddleware, roleMiddleware } from '../middlewares/auth.middleware'

const cloudinaryRouter = Router()

const adminMiddleware = [authMiddleware, roleMiddleware('admin')]

cloudinaryRouter.post('/delete', adminMiddleware, deleteImages)

export default cloudinaryRouter
