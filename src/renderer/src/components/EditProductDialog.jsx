import { productApi } from '@/api'
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
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CategorySearchComponent from './CategorySearchComponent'

function EditProductDialog({ open, setOpen, setCategories, isEdit = true, productData }) {
  const [formData, setFormData] = useState({
    isFeatured: String(productData?.isFeatured),
    images: productData?.images,
    categoryDetails: productData?.categoryDetails
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUploadImage = async (e) => {
    setUploadingImage(true)
    try {
      const file = e.target.files[0]

      const response = await uploadImage(file)

      console.log('response :: ', response)

      setFormData((prev) => ({
        ...prev,
        images: [
          {
            fileId: response.fileId,
            url: response.fileUrl,
            name: response.fileName
          },
          ...prev.images
        ]
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleReplaceImage = async (fileIndex, e) => {
    e.preventDefault()
    setUploadingImage(true)
    try {
      const file = e.target.files[0]

      await deleteImage(formData.images[fileIndex].fileId)

      const response = await uploadImage(file)

      console.log('response :: ', response)

      setFormData((prev) => ({
        ...prev,
        images: prev.images.splice(fileIndex, 1, {
          fileId: response.fileId,
          url: response.fileUrl,
          name: response.fileName
        })
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = async (fileId) => {
    setUploadingImage(true)
    try {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.fileId !== fileId)
      }))
      await deleteImage(fileId)
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
      const payload = {
        images: formData.images.map((img) => ({
          fileId: img.fileId,
          url: img.url,
          name: img.name
        })),
        isFeatured: formData.isFeatured === 'true',
        categoryId: formData.categoryDetails?._id
      }

      console.log('formData :: ', payload)

      const response = await productApi.updateProduct(productData.rid, payload)

      console.log('response :: ', response)

      if (response.success) {
        toast.success(response.message)
        setFormData({
          name: '',
          visibility: 'true',
          images: []
        })
        setCategories((prev) =>
          isEdit
            ? prev.map((cat) => (cat._id === productData._id ? response.data : cat))
            : [...prev, response.data]
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
    if (open && productData) {
      setFormData({
        ...productData,
        isFeatured: String(productData?.isFeatured)
      })
    }
  }, [open, productData])

  console.log('formData :: ', formData)

  return (
    <Dialog open={open} onOpenChange={setOpen} key={productData?._id}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Details of {productData?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className=" space-y-2">
          <div className="grid sm:grid-cols-2 gap-2">
            <div className=" space-y-2">
              <Label htmlFor="name">Select Category</Label>
              <CategorySearchComponent
                onCategorySelect={(category) =>
                  setFormData((prev) => ({ ...prev, categoryDetails: category }))
                }
                selectedCategory={formData.categoryDetails?._id}
              />
            </div>
            <div className=" space-y-2">
              <Label htmlFor="isFeatured">Featured</Label>
              <Select
                name="isFeatured"
                value={formData.isFeatured}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isFeatured: value }))}
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'true'}>Yes</SelectItem>
                  <SelectItem value={'false'}>No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleUploadImage} multiple />
          </div>

          <div className="grid md:grid-cols-4 gap-1">
            {uploadingImage && (
              <div className="w-40 h-40 flex items-center justify-center rounded border">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            {formData?.images?.map((image, index) => (
              <div
                key={image.fileId || index}
                className="relative w-40 h-40 group overflow-hidden rounded shadow-lg"
              >
                <img
                  src={image.url}
                  alt={`Product Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleReplaceImage(index, e)}
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      title="Replace Image"
                      disabled={uploadingImage}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </label> */}

                  <Button
                    size="icon"
                    variant="destructive"
                    className="rounded-full"
                    title="Remove Image"
                    disabled={uploadingImage}
                    onClick={() => handleRemoveImage(image.fileId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || uploadingImage || !formData.name}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Plus className="h-4 w-4" />
            Update Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProductDialog
