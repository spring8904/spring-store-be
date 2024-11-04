import express from 'express'
import { StatusCodes } from 'http-status-codes'
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
  res.status(StatusCodes.OK).send('pong')
})

export default router
