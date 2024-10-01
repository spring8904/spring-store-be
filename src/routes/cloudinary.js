import { Router } from 'express'
import { deleteImages } from '../controllers/cloudinary'
import checkPermission from '../middlewares/checkPermission'

const cloudinaryRouter = Router()

cloudinaryRouter.post('/delete', checkPermission, deleteImages)

export default cloudinaryRouter
