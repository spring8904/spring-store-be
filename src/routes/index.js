import express from 'express'
import authRouter from './auth'
import productRouter from './product'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)

export default router
