import Joi from 'joi'

export const getCartByUserIdSchema = Joi.object({
  userId: Joi.string().required(),
})

export const productCartOperationSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
}).options({ abortEarly: false })

export const removeProductFromCartSchema = Joi.object({
  userId: Joi.string().required(),
  productId: Joi.string().required(),
}).options({ abortEarly: false })
