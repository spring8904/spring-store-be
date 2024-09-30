import { Router } from 'express'
import { deleteImage } from '../controllers/cloudinary'

const cloudinaryRouter = Router()

cloudinaryRouter.delete('/:publicId', deleteImage)

export default cloudinaryRouter
