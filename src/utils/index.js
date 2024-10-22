import { StatusCodes } from 'http-status-codes'

export const getPublicIdFromUrl = (url) => {
  const regex = /\/upload\/(?:v\d+\/)?([^.]+)/
  const matches = url.match(regex)
  return matches ? matches[1] : null
}

export const handleValidationError = (error, res) => {
  const message = error.details.map((err) => err.message)
  return res.status(StatusCodes.BAD_REQUEST).json({ message })
}
