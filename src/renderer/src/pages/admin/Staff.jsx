import { staffApi } from '@/api'
import AddEditStaffDialog from '@/components/AddEditStaffDialog'
import ViewStaffDialog from '@/components/ViewStaffDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Edit2, Eye, Plus, Power, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router'

function Staff() {
  const navigate = useNavigate()

  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const response = await staffApi.getAllStaff({
        page: pagination.page,
        limit: pagination.limit,
        query
      })

      const data = response.data
      console.log('Fetched staff data:', data)

      setStaff(data.staff || [])
      setPagination({
        page: data.currentPage || pagination.page,
        limit: pagination.limit,
        total: data.totalStaff || 0,
        totalPages: data.totalPages || 1
      })

      setStats({
        total: data.totalStaff || 0,
        active: data.totalActiveStaff || 0
      })
    } catch (error) {
      console.error('Error fetching staff:', error)
      toast.error('Failed to fetch staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [pagination.page, pagination.limit, query])

  const handleSearch = () => {
    setQuery(searchInput)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }))
  }

  const handleView = (staffMember) => {
    navigate(`/admin/staff/${staffMember._id}`, {
      state: {
        staffMember
      }
    })
  }

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember)
    setOpenEdit(true)
  }

  const handleDelete = async (staffId) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      const response = await staffApi.deleteStaff(staffId)

      if (response?.success) {
        toast.success(response.message || 'Staff deleted successfully')
        fetchStaff()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message || 'Failed to delete staff')
    }
  }

  const handleToggleStatus = async (staffMember) => {
    try {
      const newStatus = staffMember.isActive === true ? false : true
      const response = await staffApi.updateStaff(staffMember._id, {
        isActive: newStatus
      })

      if (response?.success) {
        toast.success(`Staff marked as ${newStatus}`)
        // Update the staff list with new status
        setStaff((prev) =>
          prev.map((member) =>
            member._id === staffMember._id ? { ...member, isActive: newStatus } : member
          )
        )
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message || 'Failed to update staff status')
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden px-6 py-4 gap-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={() => fetchStaff()} disabled={loading} variant="outline">
          <IoIosRefresh className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
        <Button
          onClick={() => {
            setSelectedStaff(null)
            setOpenAdd(true)
          }}
          className="gap-2"
          title="Add New Staff"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Table Container */}
      <div className="flex flex-col flex-1 overflow-hidden border">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="h-8 w-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading staff...</p>
            </div>
          </div>
        ) : staff.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No staff members found</p>
              <p className="text-sm">Click "Add Staff" to create a new staff member</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-primary text-white z-10 shadow-sm">
                <TableRow>
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Phone</TableHead>
                  <TableHead className="text-white">Role</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{staffMember.name}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.phone || '-'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {staffMember.role || 'Staff'}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="View Details"
                          className="h-8 w-8 text-blue-600 rounded bg-blue-200 hover:text-blue-700 hover:bg-blue-100 "
                          onClick={() => handleView(staffMember)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit"
                          className="h-8 w-8 text-amber-600 rounded bg-amber-200 hover:text-amber-700 hover:bg-amber-100"
                          onClick={() => handleEdit(staffMember)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 rounded ${
                            staffMember.isActive === true
                              ? 'text-green-600 bg-green-200 hover:text-green-700 hover:bg-green-100'
                              : 'text-red-600 bg-red-200 hover:text-red-700 hover:bg-red-100'
                          }`}
                          onClick={() => handleToggleStatus(staffMember)}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        {/* <Button
                          size="icon"
                          variant="ghost"
                          title="Delete"
                          className="h-8 w-8 text-red-600 rounded bg-red-200 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDelete(staffMember._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {!loading && staff.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show per page:</span>
              <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ViewStaffDialog open={openView} setOpen={setOpenView} staffData={selectedStaff} />
      <AddEditStaffDialog
        open={openAdd}
        setOpen={setOpenAdd}
        onSuccess={fetchStaff}
        isEdit={false}
      />
      <AddEditStaffDialog
        open={openEdit}
        setOpen={setOpenEdit}
        onSuccess={fetchStaff}
        isEdit={true}
        staffData={selectedStaff}
      />
    </div>
  )
}

export default Staff
