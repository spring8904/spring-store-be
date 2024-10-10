import { Router } from 'express'
import {
  addProductToCart,
  getCartByUserId,
  removeProductFromCart,
  updateProductQuantity,
} from '../controllers/cart'
import { authMiddleware, validateUserOwnership } from '../middlewares/auth'

const cartRouter = Router()

cartRouter.use(authMiddleware)

cartRouter.use('/:userId', validateUserOwnership, getCartByUserId)

cartRouter
  .route('/')
  .all(validateUserOwnership)
  .post(addProductToCart)
  .put(updateProductQuantity)
  .delete(removeProductFromCart)

export default cartRouter
