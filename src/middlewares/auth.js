import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'No token provided' })

  try {
    req.user = jwt.verify(token, import.meta.env.VITE_JWT_SECRET)

    next()
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}

export const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Permission denied' })

  const { role } = req.user
  if (role !== requiredRole)
    return res.status(403).json({ message: 'Permission denied' })

  next()
}
