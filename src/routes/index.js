import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { setupSwaggerDocs } from '../swagger.js'
import authRouter from './auth.routes.js'
import cartRouter from './cart.routes.js'
import productRouter from './product.routes.js'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/cart', cartRouter)

setupSwaggerDocs(router)

router.use('/ping', (req, res) => {
  res.status(StatusCodes.OK).send('pong')
})

export default router
