import express from 'express'
import { setupSwaggerDocs } from '../swagger'
import authRouter from './auth.routes'
import cartRouter from './cart.routes'
import cloudinaryRouter from './cloudinary.routes'
import productRouter from './product.routes'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)
router.use('/cloudinary', cloudinaryRouter)

setupSwaggerDocs(router)

router.use('/ping', (req, res) => {
  res.send('pong')
})

export default router
