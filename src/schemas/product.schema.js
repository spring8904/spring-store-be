import Joi from 'joi'

export const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().min(1).required(),
  status: Joi.string().valid('draft', 'published', 'inactive').default('draft'),
  thumbnail: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false })

export const updateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  quantity: Joi.number().min(1).optional(),
  status: Joi.string().valid('draft', 'published', 'inactive').optional(),
  thumbnail: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false })
