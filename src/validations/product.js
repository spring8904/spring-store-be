import Joi from 'joi'

export const createValidator = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
}).options({ abortEarly: false })

export const updateValidator = Joi.object({
  title: Joi.string().optional(),
  price: Joi.number().greater(0).optional(),
  description: Joi.string().optional(),
  image: Joi.string().optional(),
}).options({ abortEarly: false })
