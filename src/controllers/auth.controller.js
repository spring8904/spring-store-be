import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import BlacklistedToken from '../models/BlacklistedToken'
import User from '../models/User'
import { loginSchema, registerSchema } from '../schemas/auth.schema'
import { handleValidationError } from '../utils'

export const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error) return handleValidationError(error, res)

  const { email, password } = req.body

  try {
    const existed = await User.findOne({ email })
    if (existed)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email has been registered' })

    const hashPassword = await bcryptjs.hash(password, 10)

    await User.create({ email, password: hashPassword })

    res.status(StatusCodes.CREATED).json({ message: 'Registration successful' })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error) return handleValidationError(error, res)

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user || !(await bcryptjs.compare(password, user.password)))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Wrong email or password' })

    const token = jwt.sign({ id: user.id }, import.meta.env.VITE_JWT_SECRET, {
      expiresIn: import.meta.env.VITE_JWT_EXPIRES_IN,
    })

    const sanitizedUser = {
      _id: user.id,
      email: user.email,
      role: user.role,
    }

    res.status(StatusCodes.OK).json({
      message: 'Login successful',
      token,
      user: sanitizedUser,
    })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const getCurrentUser = async (req, res) => {
  if (!req.user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Permission denied' })

  try {
    const user = await User.findById(req.user.id, 'email role')
    if (!user)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}

export const logout = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '')

  const decodedToken = jwt.decode(token)
  const expiryDate = new Date(decodedToken.exp * 1000)

  try {
    await BlacklistedToken.create({ token, expiryDate })
    res.status(StatusCodes.OK).json({ message: 'Logout successful' })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}
