import Joi from 'joi'

const stringSchema = (name) =>
  Joi.string()
    .trim()
    .required()
    .messages({
      'string.base': `${name} must be a string!`,
      'string.empty': `${name} must not be empty!`,
      'any.required': `${name} is required!`,
    })

export const productSchema = Joi.object({
  title: stringSchema('Title'),
  description: stringSchema('Description'),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number!',
    'number.min': 'Price must be greater than or equal to 0!',
    'any.required': 'Price is required!',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number!',
    'number.integer': 'Quantity must be an integer!',
    'number.min': 'Quantity must be greater than or equal to 1!',
    'any.required': 'Quantity is required!',
  }),
  status: Joi.valid('draft', 'published', 'inactive')
    .required()
    .default('draft')
    .messages({
      'any.only': 'Status is invalid!',
      'any.required': 'Status is required!',
    }),
  thumbnail: stringSchema('Thumbnail'),
  images: Joi.array().items(Joi.string()).optional(),
}).options({ abortEarly: false })
