import express from 'express'
import authRouter from './auth'
import cloudinaryRouter from './cloudinary'
import productRouter from './product'
import cardRouter from './card'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/cards', cardRouter)
router.use('/cloudinary', cloudinaryRouter)

export default router
