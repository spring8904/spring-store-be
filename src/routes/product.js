import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from '../controllers/product'
import checkPermission from '../middlewares/checkPermission'

const productRouter = Router()

productRouter.get('/', getAllProduct)
productRouter.post('/', checkPermission, createProduct)
productRouter.get('/:id', getOneProduct)
productRouter.put('/:id', checkPermission, updateProduct)
productRouter.delete('/:id', checkPermission, deleteProduct)

export default productRouter
