import { incomingOrderApi } from '@/api'
import { Badge } from '@/components/ui/badge'
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
import ViewIncomingOrderDialog from '@/components/ViewIncomingOrderDialog'
import {
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Truck,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'
import { Link } from 'react-router'

function IncomingOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    completed: 0,
    totalRevenue: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewOrderDialogOpen, setViewOrderDialogOpen] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await incomingOrderApi.getAllIncomingOrders({
        page: pagination.page,
        limit: pagination.limit,
        query
      })

      console.log(response)

      const { data, pagination: resPagination } = response
      setOrders(data || [])
      setPagination({
        page: resPagination.currentPage,
        limit: resPagination.limit,
        total: resPagination.totalItems,
        totalPages: resPagination.totalPages
      })

      // Calculate stats
      const processing = data.filter((order) => order.orderStatus === 'Processing').length
      const completed = data.filter((order) => order.orderStatus === 'Completed').length
      const totalRevenue = data.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

      setStats({
        total: resPagination.totalItems,
        processing: processing,
        completed: completed,
        totalRevenue: totalRevenue
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
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

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'outline'
      case 'Processing':
        return 'secondary'
      case 'Shipped':
        return 'default'
      case 'Delivered':
        return 'default'
      case 'Cancelled':
        return 'destructive'
      case 'Rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setViewOrderDialogOpen(true)
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await incomingOrderApi.updateIncomingOrder(orderId, {
        status
      })

      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: status } : order
          )
        )
        toast.success('Order marked as ' + status)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-8 pt-6 gap-4">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">E-commerce Orders</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All incoming orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">Pending fulfillment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders by customer name or order ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={() => fetchOrders()} disabled={loading} variant="outline">
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
                    <TableHead className="text-white">Order ID</TableHead>
                    <TableHead className="text-white">Customer</TableHead>
                    <TableHead className="text-white">Items</TableHead>
                    <TableHead className="text-white">Address</TableHead>
                    <TableHead className="text-white">Payment</TableHead>
                    <TableHead className="text-center text-white">Status</TableHead>
                    <TableHead className="text-right text-white">Total</TableHead>
                    <TableHead className="text-right text-white">Date</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <div className="flex items-center justify-center flex-1 text-muted-foreground">
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex items-center justify-center flex-1 text-muted-foreground">
                      No orders found
                    </div>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium font-mono text-xs">
                          {order._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.user.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex flex-col text-sm">
                            <span className="truncate">{order.address}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.city}, {order.state} - {order.postalCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={order.paymentMethod === 'PREPAID' ? 'default' : 'secondary'}
                          >
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getStatusVariant(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{order.totalPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-1">
                          <Button
                            variant="outline"
                            onClick={() => handleViewOrder(order)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            title="View Order Details"
                          >
                            <Eye className="h-6 w-6" />
                          </Button>

                          {order.orderStatus === 'Pending' ? (
                            <Button
                              variant="outline"
                              className=" h-8 w-8 text-green-600 hover:text-green-700"
                              title="Accept Order"
                              onClick={() => handleUpdateOrderStatus(order._id, 'Processing')}
                            >
                              <Check className="h-6 w-6" />
                            </Button>
                          ) : order.orderStatus === 'Processing' ? (
                            <Button
                              variant="outline"
                              className=" h-8 w-8 text-green-600 hover:text-green-700"
                              title="Create Invoice"
                              onClick={() => handleUpdateOrderStatus(order._id, 'Processing')}
                            >
                              <Plus className="h-6 w-6" />
                            </Button>
                          ) : (
                            <></>
                          )}

                          {order.orderStatus !== 'Shipped' &&
                            order.orderStatus !== 'Delivered' &&
                            order.orderStatus !== 'Cancelled' &&
                            order.orderStatus !== 'Rejected' && (
                              <Button
                                variant="outline"
                                className=" h-8 w-8 text-red-600 hover:text-red-700"
                                title="Reject Order"
                                onClick={() => handleUpdateOrderStatus(order._id, 'Rejected')}
                              >
                                <X className="h-6 w-6" />
                              </Button>
                            )}
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
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ViewIncomingOrderDialog
        open={viewOrderDialogOpen}
        setOpen={setViewOrderDialogOpen}
        orderData={selectedOrder}
      />
    </div>
  )
}

export default IncomingOrders
