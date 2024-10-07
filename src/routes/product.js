import { Router } from 'express'
import {
  createProduct,
  deleteProduct,
  getProductBySlug,
  getProducts,
  updateProduct,
} from '../controllers/product'
import { authMiddleware, roleMiddleware } from '../middlewares/auth'
import { uploadCloud } from '../middlewares/upload'

const productRouter = Router()

const adminMiddleware = [authMiddleware, roleMiddleware('admin')]

productRouter.get('/', getProducts)
productRouter.get('/:slug', getProductBySlug)
productRouter.post(
  '/',
  adminMiddleware,
  uploadCloud.fields([
    { name: 'thumbnailFile', maxCount: 1 },
    { name: 'imagesFile', maxCount: 10 },
  ]),
  createProduct,
)
productRouter.put(
  '/:id',
  adminMiddleware,
  uploadCloud.fields([
    { name: 'thumbnailFile', maxCount: 1 },
    { name: 'imagesFile', maxCount: 10 },
  ]),
  updateProduct,
)
productRouter.delete('/:id', adminMiddleware, deleteProduct)

export default productRouter
