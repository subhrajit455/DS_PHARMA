import { staffApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Edit3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function AddEditStaffDialog({ open, setOpen, onSuccess, isEdit = false, staffData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    assignedTo: 'none',
    role: 'staff',
    joinDate: new Date().toISOString().split('T')[0]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [staffOptions, setStaffOptions] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [selectedStaffUser, setSelectedStaffUser] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error('Name is required')
        return
      }
      if (!formData.email.trim()) {
        toast.error('Email is required')
        return
      }
      if (!isEdit && !formData.password.trim()) {
        toast.error('Password is required')
        return
      }

      let response

      if (isEdit) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          joinDate: formData.joinDate
        }
        if (formData.assignedTo && formData.assignedTo !== 'none') {
          updateData.assignedTo = formData.assignedTo
          // Include all staff details from the selected user
          if (selectedStaffUser) {
            // updateData.assignedStaff = selectedStaffUser
            updateData.userId = formData.assignedTo
            updateData.address1 = selectedStaffUser.Address1 || ''
            updateData.address2 = selectedStaffUser.Address2 || ''
            updateData.address3 = selectedStaffUser.Address3 || ''
          }
        }
        if (formData.password.trim()) {
          updateData.password = formData.password
        }
        response = await staffApi.updateStaff(staffData._id, updateData)
      } else {
        // include all selected staff details if selected
        const payload = { ...formData }
        if (selectedStaffUser && formData.assignedTo !== 'none') {
          // Include all staff details from the selected user
          //   payload.assignedStaff = selectedStaffUser
          payload.userId = formData.assignedTo
          payload.address1 = selectedStaffUser.Address1 || ''
          payload.address2 = selectedStaffUser.Address2 || ''
          payload.address3 = selectedStaffUser.Address3 || ''
        } else {
          if (!payload.assignedTo || payload.assignedTo === 'none') delete payload.assignedTo
        }
        response = await staffApi.createStaff(payload)
      }

      if (response?.success) {
        toast.success(
          response.message || (isEdit ? 'Staff updated successfully' : 'Staff created successfully')
        )
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          assignedTo: 'none',
          role: 'staff',
          joinDate: new Date().toISOString().split('T')[0]
        })
        setOpen(false)
        if (onSuccess) {
          onSuccess()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message || (isEdit ? 'Failed to update staff' : 'Failed to create staff'))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (open && isEdit && staffData) {
      setFormData({
        name: staffData.name || '',
        email: staffData.email || '',
        password: '',
        phone: staffData.phone || '',
        assignedTo: staffData.assignedTo || 'none',
        role: staffData.role || 'staff',
        joinDate: staffData.joinDate
          ? new Date(staffData.joinDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      })
    } else if (open && !isEdit) {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        assignedTo: 'none',
        role: 'staff',
        joinDate: new Date().toISOString().split('T')[0]
      })
    }
  }, [open, isEdit, staffData])

  // fetch staff options for select
  useEffect(() => {
    const fetchOptions = async () => {
      setOptionsLoading(true)
      try {
        const res = await staffApi.marggetAllStaff()
        const list = res?.data || []
        console.log('Fetched staff options:', list)
        setStaffOptions(list)
      } catch (err) {
        console.error('Failed to load staff options', err)
      } finally {
        setOptionsLoading(false)
      }
    }

    if (open) fetchOptions()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Staff
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add New Staff
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Assigned To Select */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign To (required)</Label>
            <Select
              name="assignedTo"
              value={formData.assignedTo}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, assignedTo: value }))
                // Store the full selected staff object
                const selected = staffOptions.find((opt) => opt.UserID === value)
                setSelectedStaffUser(selected || null)
                setFormData({
                  name: selected?.Name || '',
                  email: selected?.Email || '',
                  phone: selected?.Phone || ''
                })
              }}
              className="w-full"
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={optionsLoading ? 'Loading...' : 'Select staff to assign'}
                />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No staff available
                  </SelectItem>
                ) : (
                  staffOptions.map((opt, index) => (
                    <SelectItem key={index} value={opt.UserID}>
                      {opt.UserID} - {opt.Name || opt.Email || 'Unnamed'}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">
              Password{' '}
              {isEdit && (
                <span className="text-xs text-muted-foreground">(Leave empty to keep current)</span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? 'Leave empty to keep current password' : 'Enter password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.name || !formData.email}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Staff' : 'Create Staff'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditStaffDialog
