import { productApi } from '@/api'
import EditProductDialog from '@/components/EditProductDialog'
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
import ViewProductDialog from '@/components/ViewProductDialog'
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Loader2,
  Package,
  Pencil,
  Search,
  TrendingDown
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'

function StockExpiry() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outStock: 0,
    expiringSoon: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('exp')
  const [sortOrder, setSortOrder] = useState(1)
  const [stockStatus, setStockStatus] = useState(1)
  const [isDeleted, setIsDeleted] = useState(0)

  const [editDialog, setEditDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewDialog, setViewDialog] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    toast.loading('Fetching products...')
    try {
      const response = await productApi.getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        query,
        sortBy: sort,
        order: sortOrder,
        stock: stockStatus,
        is_deleted: isDeleted
      })

      if (response.success) {
        const data = response.data
        toast.dismiss()
        toast.success(response.message || 'Products loaded successfully')

        setProducts(data.products || [])
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.totalProducts,
          totalPages: data.totalPages
        })

        // Calculate low stock and expiring soon
        const lowStock = data.products.filter(
          (p) => parseFloat(p.stock) > 0 && parseFloat(p.stock) <= 10
        ).length
        const expiringSoon = data.products.filter((p) => {
          if (!p.exp || p.exp === '        ') return false
          const expDate = new Date(
            p.exp.slice(0, 4),
            parseInt(p.exp.slice(4, 6)) - 1,
            p.exp.slice(6, 8)
          )
          const today = new Date()
          const daysUntilExpiry = Math.floor((expDate - today) / (1000 * 60 * 60 * 24))
          return daysUntilExpiry >= 0 && daysUntilExpiry <= 90
        }).length

        setStats({
          total: data.totalProducts,
          lowStock: lowStock,
          outStock: data.totalOutStock,
          expiringSoon: expiringSoon
        })
      }
    } catch (error) {
      toast.dismiss()
      console.error('Error fetching products:', error)
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [pagination.page, pagination.limit, query, sort, sortOrder, stockStatus, isDeleted])

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

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditDialog(true)
  }

  const handleView = (product) => {
    setSelectedProduct(product)
    setViewDialog(true)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-8 pt-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">Stock & Expiry</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Stock ≤ 10 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outStock}</div>
            <p className="text-xs text-muted-foreground">Unavailable items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 90 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name or code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Select value={sort} onValueChange={(value) => setSort(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="exp">Expiry Date</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="code">Code</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={1}>Ascending</SelectItem>
              <SelectItem value={-1}>Descending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={stockStatus} onValueChange={(value) => setStockStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Stock status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={0}>Out of Stock</SelectItem>
              <SelectItem value={1}>In Stock</SelectItem>
              <SelectItem value={2}>All</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => fetchProducts()} disabled={loading} variant="outline">
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
                    <TableHead className="bg-primary text-white">Batch</TableHead>
                    <TableHead className="bg-primary text-white">Expiry</TableHead>
                    <TableHead className="text-center bg-primary text-white">Stock</TableHead>
                    <TableHead className="bg-primary text-white">MRP</TableHead>
                    <TableHead className="text-center bg-primary text-white">
                      Stock Status
                    </TableHead>
                    <TableHead className="text-center bg-primary text-white">
                      Expiry Status
                    </TableHead>
                    <TableHead className="text-right bg-primary text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading products...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium font-mono text-xs">
                          {product.code}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product.name}</span>
                            {product.company && (
                              <span className="text-xs text-muted-foreground">
                                {product.company}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-sm font-mono">
                          {product.curbatch || '-'}
                        </TableCell>

                        <TableCell>
                          {(() => {
                            if (!product.exp || product.exp === '        ') return '-'
                            const expStr = product.exp
                            const year = expStr.slice(0, 4)
                            const month = expStr.slice(4, 6)
                            const day = expStr.slice(6, 8)
                            return `${day}/${month}/${year}`
                          })()}
                        </TableCell>

                        <TableCell className="text-center">
                          <span
                            className={
                              product.stock <= 0
                                ? 'text-red-600 font-medium'
                                : product.stock <= 10
                                  ? 'text-orange-600 font-medium'
                                  : 'text-green-600 font-medium'
                            }
                          >
                            {product.stock ?? 0}
                          </span>
                        </TableCell>

                        <TableCell className="font-medium">
                          ₹{Number(product.MRP || 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Badge
                            variant={
                              product.stock <= 0
                                ? 'destructive'
                                : product.stock <= 10
                                  ? 'secondary'
                                  : 'default'
                            }
                          >
                            {product.stock <= 0
                              ? 'Out of Stock'
                              : product.stock <= 10
                                ? 'Low Stock'
                                : 'In Stock'}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-center">
                          {(() => {
                            if (!product.exp || product.exp === '        ')
                              return <Badge variant="outline">No Expiry</Badge>
                            const expDate = new Date(
                              product.exp.slice(0, 4),
                              parseInt(product.exp.slice(4, 6)) - 1,
                              product.exp.slice(6, 8)
                            )
                            const today = new Date()
                            const daysUntilExpiry = Math.floor(
                              (expDate - today) / (1000 * 60 * 60 * 24)
                            )

                            if (daysUntilExpiry < 0)
                              return (
                                <Badge variant="destructive" className="bg-red-600">
                                  Expired
                                </Badge>
                              )
                            if (daysUntilExpiry <= 30)
                              return (
                                <Badge variant="destructive" className="bg-orange-600">
                                  {daysUntilExpiry}d left
                                </Badge>
                              )
                            if (daysUntilExpiry <= 90)
                              return (
                                <Badge variant="secondary" className="bg-yellow-600 text-white">
                                  {daysUntilExpiry}d left
                                </Badge>
                              )
                            return (
                              <Badge variant="default" className="bg-green-600">
                                {daysUntilExpiry}d left
                              </Badge>
                            )
                          })()}
                        </TableCell>

                        <TableCell className="text-right flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(product)}
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
                disabled={pagination.page >= pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ViewProductDialog open={viewDialog} setOpen={setViewDialog} productData={selectedProduct} />

      <EditProductDialog
        open={editDialog}
        setOpen={setEditDialog}
        setCategories={setProducts}
        isEdit={true}
        productData={selectedProduct}
      />
    </div>
  )
}

export default StockExpiry
