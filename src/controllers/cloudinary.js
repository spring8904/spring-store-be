import { v2 as cloudinary } from 'cloudinary'
import { getPublicIdFromUrl } from '../../utils/cloudinary'

cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
})

export const deleteImages = async (req, res) => {
  try {
    const { urls } = req.body
    if (!urls || urls.length === 0) {
      return res.status(400).json({ message: 'Image URLs are required' })
    }

    const publicIds = urls.map((url) => getPublicIdFromUrl(url))
    let result
    if (publicIds.length === 1) {
      result = await cloudinary.uploader.destroy(publicIds[0])
    } else {
      result = await cloudinary.api.delete_resources(publicIds)
    }

    return res.status(200).json({
      message: `${publicIds.length} images deleted successfully`,
      result,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete images', error })
  }
}
