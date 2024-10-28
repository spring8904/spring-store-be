import Joi from 'joi'

const idSchema = Joi.string().required().messages({
  'string.base': 'Something wrong!',
  'string.empty': 'Something wrong!',
  'any.required': 'Something wrong!',
})

const quantitySchema = Joi.number().integer().min(1).required().messages({
  'number.base': 'Something wrong!',
  'number.integer': 'Something wrong!',
  'number.min': 'Something wrong!',
  'any.required': 'Something wrong!',
})

export const getCartByUserIdSchema = Joi.object({
  userId: idSchema,
})

export const productCartOperationSchema = Joi.object({
  userId: idSchema,
  productId: idSchema,
  quantity: quantitySchema,
}).options({ abortEarly: false })

export const removeProductFromCartSchema = Joi.object({
  userId: idSchema,
  productId: idSchema,
}).options({ abortEarly: false })
