import jwt from 'jsonwebtoken'

const checkPermission = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET)

    if (decoded.role !== 'admin')
      return res.status(403).json({ message: 'Permission denied' })

    next()
  } catch (error) {
    return error.name === 'TokenExpiredError'
      ? res.status(401).json({ message: 'Token expired, need to renew' })
      : res.status(401).json({ message: 'Invalid Token' })
  }
}

export default checkPermission
