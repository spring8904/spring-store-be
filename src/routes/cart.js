import { Router } from 'express'
import {
  addProductToCart,
  getCartByUserId,
  removeProductFromCart,
  updateProductQuantity,
} from '../controllers/cart'
import { authMiddleware, validateUserOwnership } from '../middlewares/auth'

const cartRouter = Router()

cartRouter.use(authMiddleware, validateUserOwnership)

cartRouter
  .route('/')
  .get(getCartByUserId)
  .post(addProductToCart)
  .put(updateProductQuantity)
  .delete(removeProductFromCart)

export default cartRouter
