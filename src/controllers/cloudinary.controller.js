import { StatusCodes } from 'http-status-codes'
import cloudinary from '../config/cloudinary.config'
import { getPublicIdFromUrl } from '../utils'

export const deleteImages = async (req, res) => {
  try {
    const { urls } = req.body
    if (!urls || urls.length === 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Image URLs are required' })

    const publicIds = urls.map((url) => getPublicIdFromUrl(url))
    const result =
      publicIds.length === 1
        ? await cloudinary.uploader.destroy(publicIds[0])
        : await cloudinary.api.delete_resources(publicIds)

    return res.status(StatusCodes.OK).json({
      message: `${publicIds.length} images deleted successfully`,
      result,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete images', error })
  }
}
