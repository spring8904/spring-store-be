import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
} from '../controllers/product'

const productRouter = Router()

productRouter.get('/', getAllProduct)
productRouter.post('/', createProduct)
productRouter.get('/:id', getOneProduct)
productRouter.put('/:id', updateProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter
