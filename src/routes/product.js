import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product'
import checkPermission from '../middlewares/checkPermission'

const productRouter = Router()

productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', checkPermission, createProduct)
productRouter.put('/:id', checkPermission, updateProduct)
productRouter.delete('/:id', checkPermission, deleteProduct)

export default productRouter
