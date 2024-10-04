import { Router } from 'express'
import { deleteImages } from '../controllers/cloudinary'
import { authMiddleware, roleMiddleware } from '../middlewares/auth'

const cloudinaryRouter = Router()

const adminMiddleware = [authMiddleware, roleMiddleware('admin')]

cloudinaryRouter.post('/delete', adminMiddleware, deleteImages)

export default cloudinaryRouter
