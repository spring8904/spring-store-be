import Joi from 'joi'

const emailSchema = Joi.string()
  .trim()
  .email()
  .pattern(/@gmail\.com$/)
  .required()
  .messages({
    'string.base': 'Email must be a string!',
    'string.empty': 'Email must not be empty!',
    'string.email': 'Email must be a valid email!',
    'string.pattern.base': 'Email must be a valid gmail address!',
    'any.required': 'Email is required!',
  })

const passwordSchema = Joi.string().trim().min(6).required().messages({
  'string.base': 'Password must be a string!',
  'string.empty': 'Password must not be empty!',
  'string.min': 'Password must be at least 6 characters!',
  'any.required': 'Password is required!',
})

export const registerSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
}).options({ abortEarly: false })

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
}).options({ abortEarly: false })
