import { outgoingOrderApi } from '@/api'
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
import ViewInvoiceDialog from '@/components/ViewInvoiceDialog'
import { OrderPDFButton } from '@/components/OrderPDF'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  FileText,
  Calendar,
  Package
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    totalQuantity: 0,
    totalOrders: 0
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
  const [sort, setSort] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState(-1)

  const [viewDialog, setViewDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const salesId = localStorage.getItem('salerId') || '301245' // fallback
      const response = await outgoingOrderApi.getAllOrders({
        page: pagination.page,
        limit: pagination.limit,
        query,
        sortBy: sort,
        order: sortOrder
      })

      if (response.success) {
        const data = response.data
        setInvoices(data.orders || [])
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.totalOrders,
          totalPages: data.totalPages,
          hasMore: data.hasMore
        })

        // Calculate stats
        setStats({
          total: data.totalOrders,
          totalOrders: data.totalOrders
        })
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prevQuery) => {
        if (prevQuery !== searchInput) {
          setPagination((prev) => ({ ...prev, page: 1 }))
          return searchInput
        }
        return prevQuery
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(newLimit), page: 1 }))
  }

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setViewDialog(true)
  }

  useEffect(() => {
    fetchInvoices()
  }, [pagination.page, pagination.limit, query, sort, sortOrder])

  return (
    <div className="flex flex-col h-full overflow-hidden px-6 py-4 gap-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All invoices/orders</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuantity}</div>
            <p className="text-xs text-muted-foreground">Items ordered</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <div className="flex flex-col flex-1 overflow-hidden gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders by customer name, order ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="CustName">Customer</SelectItem>
              <SelectItem value="OrderID">Order ID</SelectItem>
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
          <Button onClick={() => fetchInvoices()} disabled={loading} variant="outline">
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
                    <TableHead className="bg-primary text-white">Order ID</TableHead>
                    <TableHead className="bg-primary text-white">Order No</TableHead>
                    <TableHead className="bg-primary text-white">Date</TableHead>
                    <TableHead className="bg-primary text-white">Customer</TableHead>
                    <TableHead className="bg-primary text-white">Address</TableHead>
                    <TableHead className="bg-primary text-white text-right">Qty</TableHead>
                    <TableHead className="bg-primary text-white text-right">Net</TableHead>
                    <TableHead className="bg-primary text-white text-right">Disc.</TableHead>
                    <TableHead className="bg-primary text-white text-right">Tax</TableHead>
                    <TableHead className="bg-primary text-white text-right">Total</TableHead>
                    {/* <TableHead className="bg-primary text-white">GST Type</TableHead>
                    <TableHead className="bg-primary text-white">Payment</TableHead> */}
                    <TableHead className="text-right bg-primary text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading invoices...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-6 text-muted-foreground">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => {
                      const products = invoice?.ProductDetails || []
                      const gstType = invoice?.PaymentDetails?.gstType

                      const paymentLabel =
                        invoice?.PaymentDetails?.paymentmode === '1'
                          ? 'Cash'
                          : invoice?.PaymentDetails?.paymentmode === '2'
                            ? 'Card'
                            : invoice?.PaymentDetails?.paymentmode === '3'
                              ? 'Online'
                              : '--'

                      return (
                        <TableRow key={invoice._id}>
                          <TableCell className="font-medium text-xs">{invoice.OrderID}</TableCell>
                          <TableCell className="text-xs">{invoice.OrderNo || '--'}</TableCell>
                          <TableCell className="text-xs">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {invoice?.CustomerDetails?.CustName || '--'}
                              </span>
                              {invoice?.CustomerDetails?.CustMobile && (
                                <span className="text-xs text-muted-foreground">
                                  {invoice.CustomerDetails.CustMobile}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-xs max-w-[120px] truncate"
                            title={[
                              invoice?.CustomerDetails?.shipAdd1,
                              invoice?.CustomerDetails?.shipAdd2,
                              invoice?.CustomerDetails?.Address
                            ]
                              .filter(Boolean)
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .join(', ')}
                          >
                            {[
                              invoice?.CustomerDetails?.shipAdd1,
                              invoice?.CustomerDetails?.shipAdd2,
                              invoice?.CustomerDetails?.Address
                            ]
                              .filter(Boolean)
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .join(', ') || '--'}
                          </TableCell>
                          <TableCell className="text-xs text-right">{products.length}</TableCell>
                          <TableCell className="text-xs text-right">
                            {parseFloat(invoice.PaymentDetails.totalAmount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {invoice.PaymentDetails.totalDiscountAmount > 0
                              ? `${parseFloat(invoice.PaymentDetails.totalDiscountAmount || 0).toFixed(2)}`
                              : '0.00'}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {invoice.PaymentDetails.totalTaxAmount > 0
                              ? `${parseFloat(invoice.PaymentDetails.totalTaxAmount || 0).toFixed(2)}`
                              : '0.00'}
                          </TableCell>
                          {/* <TableCell className="text-xs text-right">
                            {gstType !== 'igst'
                              ? (parseFloat(invoice.PaymentDetails.totalTaxAmount) / 2).toFixed(2)
                              : '0.00'}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {gstType !== 'igst'
                              ? (parseFloat(invoice.PaymentDetails.totalTaxAmount) / 2).toFixed(2)
                              : '0.00'}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            {gstType === 'igst'
                              ? parseFloat(invoice.PaymentDetails.totalTaxAmount).toFixed(2)
                              : '0.00'}
                          </TableCell> */}
                          <TableCell className="text-xs text-right">
                            {parseFloat(invoice.PaymentDetails.totalInvoiceValue || 0).toFixed(2)}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                className="h-8 w-8"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <OrderPDFButton order={invoice} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
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

      <ViewInvoiceDialog open={viewDialog} setOpen={setViewDialog} invoiceData={selectedInvoice} />
    </div>
  )
}
