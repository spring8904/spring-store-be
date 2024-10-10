import { Router } from 'express'
import {
  addToCard,
  getCard,
  removeFromCard,
  updateQuantity,
} from '../controllers/card'
import { authMiddleware, validateUserOwnership } from '../middlewares/auth'

const cardRouter = Router()

cardRouter.use('/:userId', authMiddleware, validateUserOwnership)

cardRouter.route('/:userId').get(getCard).post(addToCard)

cardRouter
  .route('/:userId/:productId')
  .put(updateQuantity)
  .delete(removeFromCard)

export default cardRouter
