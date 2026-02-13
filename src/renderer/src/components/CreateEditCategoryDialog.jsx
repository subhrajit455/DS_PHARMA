import { categoryApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { deleteImage, uploadImage } from '@/config/mediaService'
import { addCategory, updateCategory } from '@/store/features/categorySlice'
import { Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

function CreateEditCategory({ open, setOpen, isEdit = false, categoryData }) {
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: isEdit ? categoryData?.name : '',
    visibility: isEdit ? categoryData?.visibility : 'true',
    images: isEdit ? categoryData?.images : []
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = async (e) => {
    setUploadingImage(true)
    try {
      const file = e.target.files[0]

      const isReplacing = formData.images.length > 0

      if (isReplacing) {
        await deleteImage(formData.images[0].fileId)
      }

      const response = await uploadImage(file)

      console.log('response :: ', response)

      setFormData((prev) => ({
        ...prev,
        images: [
          {
            fileId: response.fileId,
            url: response.fileUrl,
            name: response.fileName
          }
        ]
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let response

      if (isEdit) {
        response = await categoryApi.updateCategory(categoryData._id, formData)
      } else {
        response = await categoryApi.createCategory(formData)
      }

      console.log('response :: ', response)

      if (response.success) {
        toast.success(response.message)
        setFormData({
          name: '',
          visibility: 'true',
          images: []
        })
        dispatch(
          isEdit
            ? updateCategory({ _id: categoryData._id, data: response.data })
            : addCategory(response.data)
        )
      }
    } catch (error) {
      console.log(error)
      toast.error(isEdit ? 'Failed to update category' : 'Failed to create category')
    } finally {
      setIsSubmitting(false)
      setOpen(false)
    }
  }

  useEffect(() => {
    if (open && isEdit && categoryData) {
      setFormData({
        name: categoryData.name,
        visibility: categoryData.visibility.toString(),
        images: categoryData.images || []
      })
    } else if (open && !isEdit) {
      setFormData({
        name: '',
        visibility: 'true',
        images: []
      })
    }
  }, [open, isEdit, categoryData])

  return (
    <Dialog open={open} onOpenChange={setOpen} key={categoryData?._id}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className=" space-y-2">
          <div className="grid sm:grid-cols-3 gap-2">
            <div className=" space-y-2 col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className=" space-y-2">
              <Label htmlFor="visibility">Status</Label>
              <Select
                name="visibility"
                value={formData.visibility}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, visibility: value }))}
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'true'}>Visible</SelectItem>
                  <SelectItem value={'false'}>Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className=" space-y-2">
            {uploadingImage && (
              <div className="w-40 h-40 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {formData?.images?.length > 0 && !uploadingImage && (
              <img
                src={formData?.images[0]?.url}
                alt="Preview"
                className="w-40 h-40 object-cover shadow-lg"
              />
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || uploadingImage || !formData.name}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Plus className="h-4 w-4" />
            {isEdit ? 'Update Category' : 'Create Category'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateEditCategory
