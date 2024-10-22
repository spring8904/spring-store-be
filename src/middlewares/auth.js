import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import BlacklistedToken from '../models/BlacklistedToken'

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'No token provided' })

  try {
    const blacklistedToken = await BlacklistedToken.findOne({ token })
    if (blacklistedToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: 'Token is blacklisted' })
    }

    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' })
    }

    req.user = user
    next()
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' })
  }
}

export const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (!req.user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Permission denied' })

  const { role } = req.user
  if (role !== requiredRole)
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Forbidden',
    })

  next()
}

export const validateUserOwnership = (req, res, next) => {
  if (!req.user)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Permission denied' })

  const userId = req.params.userId || req.body.userId
  if (req.user.id !== userId)
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'Forbidden',
    })

  next()
}
