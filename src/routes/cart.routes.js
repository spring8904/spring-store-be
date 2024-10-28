import { Router } from 'express'
import {
  addProductToCart,
  getCartByUserId,
  removeProductFromCart,
  updateProductQuantity,
} from '../controllers/cart.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const cartRouter = Router()

cartRouter.use(authMiddleware)

cartRouter
  .route('/')
  .get(getCartByUserId)
  .post(addProductToCart)
  .put(updateProductQuantity)

cartRouter.route('/:productId').delete(removeProductFromCart)

export default cartRouter
