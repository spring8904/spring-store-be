import jwt from 'jsonwebtoken'
import User from '../models/User'

const checkPermission = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token)
      return res
        .status(401)
        .json({ message: 'No token provided, authorization denied' })

    let decoded
    try {
      decoded = jwt.verify(token, 'id')
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired, need to renew' })
      } else {
        return res.status(401).json({ error: 'Invalid Token' })
      }
    }

    const user = await User.findById(decoded.id)

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    next()
  } catch (error) {
    res.status(400).json(error)
  }
}

export default checkPermission
