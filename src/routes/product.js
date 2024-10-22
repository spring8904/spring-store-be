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

const uploadProductImages = uploadCloud.fields([
  { name: 'thumbnailFile', maxCount: 1 },
  { name: 'imagesFile', maxCount: 10 },
])

productRouter
  .route('/')
  .get(getProducts)
  .post(adminMiddleware, uploadProductImages, createProduct)

productRouter
  .route('/:id')
  .put(adminMiddleware, uploadProductImages, updateProduct)
  .delete(adminMiddleware, deleteProduct)

productRouter.get('/:slug', getProductBySlug)

export default productRouter
