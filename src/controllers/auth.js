import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { loginValidator, registerValidator } from '../validations/auth'

export const register = async (req, res) => {
  try {
    const { error } = registerValidator.validate(req.body)
    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(400).json({ message })
    }

    const { email, password } = req.body

    const existed = await User.findOne({ email })
    if (existed) {
      return res.status(400).json({ message: 'Email has been registered' })
    }

    const hashPassword = await bcryptjs.hash(password, 10)

    const data = await User.create({ email, password: hashPassword })
    data.password = undefined
    data.role = undefined

    res.status(200).json({ message: 'Registration successful', data })
  } catch (error) {
    res.status(400).json(error)
  }
}

export const login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body)
    if (error) {
      const message = error.details.map((err) => err.message)
      return res.status(400).json({ message })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Wrong email or password' })
    }

    if (!(await bcryptjs.compare(password, user.password))) {
      return res.status(400).json({ message: 'Wrong email or password' })
    }

    const token = jwt.sign({ id: user.id }, 'id', { expiresIn: '1d' })

    res
      .status(200)
      .json({
        message: 'Login successful',
        token,
        isAdmin: user.role === 'admin',
      })
  } catch (error) {
    res.status(400).json(error)
  }
}
