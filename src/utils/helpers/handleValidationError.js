import { StatusCodes } from 'http-status-codes'

const handleValidationError = (error, res) => {
  const message = error.details.map((err) => err.message)
  return res.status(StatusCodes.BAD_REQUEST).json({ message })
}

export default handleValidationError
