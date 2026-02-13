import { customerApi } from '@/api'
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
import ViewCustomerDialog from '@/components/ViewCustomerDialog'
import { customerUrl } from '@/config'
import axios from 'axios'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Loader2,
  Search,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalBalance: 0,
    totalPDC: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    hasMore: false
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('name')
  const [sortOrder, setSortOrder] = useState(1)
  const [is_deleted, setIs_deleted] = useState(0)

  const [viewDialog, setViewDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await customerApi.getAllCustomers({
        page: pagination.page,
        limit: pagination.limit,
        query,
        sortBy: sort,
        order: sortOrder,
        is_deleted
      })

      const data = response.data

      console.log(data)

      setCustomers(data.parties || [])
      setPagination({
        page: data.currentPage,
        limit: data.limit,
        total: data.totalParties,
        totalPages: data.totalPages,
        hasMore: data.hasMore
      })

      // Calculate stats
      const totalBalance = data.parties.reduce((sum, party) => sum + (party.balance || 0), 0)
      const totalPDC = data.parties.reduce((sum, party) => sum + (party.pdc || 0), 0)
      const active = data.parties.filter((party) => !party.is_deleted).length

      setStats({
        total: data.totalParties,
        active: data.totalActiveParties,
        deleted: data.totalDeletedParties,
        totalBalance: data.totalBalance,
        totalPDC: data.totalPDC
      })
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [pagination.page, pagination.limit, query, sort, sortOrder, is_deleted])

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

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setViewDialog(true)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-8 pt-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">With outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Outstanding receivables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PDC</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalPDC.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Post-dated cheques</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <div className="flex flex-col flex-1 overflow-hidden gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, code, or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={is_deleted.toString()}
            onValueChange={(val) => setIs_deleted(parseInt(val))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Deleted" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Active</SelectItem>
              <SelectItem value="1">Deleted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder.toString()} onValueChange={(val) => setSortOrder(parseInt(val))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Ascending</SelectItem>
              <SelectItem value="-1">Descending</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => fetchCustomers()} disabled={loading} variant="outline">
            <IoIosRefresh className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden border">
          <div className="flex-1 overflow-auto relative">
            <div className="absolute inset-0 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-primary text-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-primary text-white">Code</TableHead>
                    <TableHead className="bg-primary text-white">Name</TableHead>
                    <TableHead className="bg-primary text-white">Address</TableHead>
                    <TableHead className="bg-primary text-white">Phone</TableHead>
                    <TableHead className="bg-primary text-white">GSTIN</TableHead>
                    <TableHead className="text-right bg-primary text-white">Balance</TableHead>
                    <TableHead className="text-right bg-primary text-white">PDC</TableHead>
                    <TableHead className="text-right bg-primary text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading customers...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow key={customer._id}>
                        <TableCell className="font-medium">
                          {customer.code?.trim() || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{customer.name || '-'}</span>
                            {customer.area?.trim() && (
                              <span className="text-xs text-muted-foreground">
                                Area: {customer.area.trim()}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {customer.address || '-'}
                        </TableCell>
                        <TableCell>
                          {customer.phone1 || customer.phone2 || customer.phone3 || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{customer.GSTIN || '-'}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              customer.balance > 0
                                ? 'font-medium text-orange-600'
                                : 'text-muted-foreground'
                            }
                          >
                            ₹{customer.balance?.toFixed(2) || '0.00'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={customer.pdc > 0 ? 'font-medium' : 'text-muted-foreground'}
                          >
                            ₹{customer.pdc?.toFixed(2) || '0.00'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewCustomer(customer)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-2 border-t shrink-0 bg-background">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="150">150</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasMore}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ViewCustomerDialog
        open={viewDialog}
        setOpen={setViewDialog}
        customerData={selectedCustomer}
      />
    </div>
  )
}

export default Customers
