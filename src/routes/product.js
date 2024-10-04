import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product'
import { authMiddleware, roleMiddleware } from '../middlewares/auth'

const productRouter = Router()

const adminMiddleware = [authMiddleware, roleMiddleware('admin')]

productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', adminMiddleware, createProduct)
productRouter.put('/:id', adminMiddleware, updateProduct)
productRouter.delete('/:id', adminMiddleware, deleteProduct)

export default productRouter
