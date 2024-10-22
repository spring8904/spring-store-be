import express from 'express'
import authRouter from './auth.routes'
import cloudinaryRouter from './cloudinary.routes'
import productRouter from './product.routes'
import cartRouter from './cart.routes'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/cloudinary', cloudinaryRouter)

export default router
