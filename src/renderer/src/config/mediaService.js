import axios from 'axios'
import toast from 'react-hot-toast'

const mediaUrl = import.meta.env.VITE_MEDIA_URL
const mediaBucketId = import.meta.env.VITE_MEDIA_BUCKET_ID
const mediaApiKey = import.meta.env.VITE_MEDIA_API_KEY

export const uploadImage = async (image) => {
  try {
    const formData = new FormData()
    formData.append('file', image)
    formData.append('folderId', mediaBucketId)
    formData.append('visibilty', 'public')

    const response = await axios.post(`${mediaUrl}/user/files/upload`, formData, {
      headers: {
        'X-API-Key': mediaApiKey,
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      toast.success(response.data.message)
      return response.data.data
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
}

export const deleteImage = async (fileId) => {
  try {
    const response = await axios.delete(`${mediaUrl}/user/files/${fileId}`, {
      headers: {
        'X-API-Key': mediaApiKey
      }
    })

    if (response.data.success) {
      return response.data.data
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
}
