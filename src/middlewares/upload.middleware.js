import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.config'

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpeg', 'png'],
  params: {
    folder: 'web209',
  },
})

export const uploadCloud = multer({ storage })
