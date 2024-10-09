import { Router } from 'express'
import {
  addToCard,
  getCard,
  removeFromCard,
  updateQuantity,
} from '../controllers/card'

const cardRouter = Router()

cardRouter.get('/:userId', getCard)
cardRouter.post('/:userId', addToCard)
cardRouter.put('/:userId/:productId', updateQuantity)
cardRouter.delete('/:userId/:productId', removeFromCard)

export default cardRouter
