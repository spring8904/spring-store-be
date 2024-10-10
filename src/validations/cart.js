import Joi from 'joi'

export const getCartByUserIdValidator = Joi.object({
  userId: Joi.string().required(),
})

export const productCartOperationValidator = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
}).options({ abortEarly: false })

export const removeProductFromCartValidator = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
}).options({ abortEarly: false })
