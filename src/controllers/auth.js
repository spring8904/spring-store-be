import bcryptjs from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { loginValidator, registerValidator } from '../validations/auth'

export const register = async (req, res) => {
  try {
    const { error } = registerValidator.validate(req.body)
    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(StatusCodes.BAD_REQUEST).json({ message })
    }

    const { email, password } = req.body

    const existed = await User.findOne({ email })
    if (existed)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Email has been registered' })

    const hashPassword = await bcryptjs.hash(password, 10)

    await User.create({ email, password: hashPassword })

    res.status(StatusCodes.CREATED).json({ message: 'Registration successful' })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body)
    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(StatusCodes.BAD_REQUEST).json({ message })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Wrong email or password' })

    if (!(await bcryptjs.compare(password, user.password)))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Wrong email or password' })

    const token = jwt.sign({ id: user.id }, import.meta.env.VITE_JWT_SECRET, {
      expiresIn: import.meta.env.VITE_JWT_EXPIRES_IN,
    })

    const sanitizedUser = {
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
  try {
    if (!req.user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Permission denied' })

    const user = await User.findById(req.user.id, '-_id email role')
    if (!user)
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message })
  }
}
