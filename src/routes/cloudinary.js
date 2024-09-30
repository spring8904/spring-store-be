import { Router } from 'express'
import { deleteImages } from '../controllers/cloudinary'

const cloudinaryRouter = Router()

cloudinaryRouter.post('/delete', deleteImages)

export default cloudinaryRouter
