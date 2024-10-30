import { Router } from 'express'
import {
  addProductToCart,
  getCart,
  removeProductFromCart,
  updateProductQuantity,
} from '../controllers/cart.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const cartRouter = Router()

cartRouter.use(authMiddleware)

cartRouter
  .route('/')
  .get(getCart)
  .post(addProductToCart)
  .put(updateProductQuantity)

cartRouter.route('/:productId').delete(removeProductFromCart)

export default cartRouter
