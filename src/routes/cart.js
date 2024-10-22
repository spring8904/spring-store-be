import { Router } from 'express'
import {
  addProductToCart,
  getCartByUserId,
  removeProductFromCart,
  updateProductQuantity,
} from '../controllers/cart'
import { authMiddleware, validateUserOwnership } from '../middlewares/auth'

const cartRouter = Router()
const itemRouter = Router({ mergeParams: true })

cartRouter.use(authMiddleware)

cartRouter.param('userId', validateUserOwnership)

cartRouter.use('/:userId/:productId', itemRouter)

cartRouter.route('/:userId').get(getCartByUserId).post(addProductToCart)

itemRouter.route('/').put(updateProductQuantity).delete(removeProductFromCart)

export default cartRouter
