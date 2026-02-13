import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { ChevronLeft, ChevronRight, Eye, Loader2, Pencil, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { IoIosRefresh } from 'react-icons/io'
import ViewProductDialog from './ViewProductDialog'
import EditProductDialog from './EditProductDialog'

function ProductTable({ apiFn, apiParams = {}, tableType = 'all', onEdit, onView, onStatsUpdate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('name')
  const [sortOrder, setSortOrder] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editDialog, setEditDialog] = useState(false)
  const [viewDialog, setViewDialog] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        query,
        sort,
        sortOrder,
        ...apiParams
      }

      const response = await apiFn(params)

      if (response.success) {
        const productData =
          response.data.products ||
          response.data.lowStockProducts ||
          response.data.expiringProducts ||
          response.data.expiredProducts ||
          []

        setProducts(productData)
        setPagination({
          page: response.data.currentPage || 1,
          limit: pagination.limit,
          total: response.data.totalProducts || 0,
          totalPages: response.data.totalPages || 0
        })

        // Update parent stats if callback provided
        if (onStatsUpdate) {
          onStatsUpdate(tableType, response.data.totalProducts || 0)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${tableType} products:`, error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchProducts()
  }, [pagination.page, pagination.limit, query, sort, sortOrder])

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditDialog(true)
  }

  const handleView = (product) => {
    setSelectedProduct(product)
    setViewDialog(true)
  }

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

  // Helper function to format expiry date
  const formatExpiryDate = (exp) => {
    if (!exp || exp === '0' || exp === '00000000') return '-'
    const expStr = exp.toString()
    if (expStr.length === 8) {
      const year = expStr.substring(0, 4)
      const month = expStr.substring(4, 6)
      const day = expStr.substring(6, 8)
      return `${day}/${month}/${year}`
    }
    return exp
  }

  // Helper function to get days until expiry
  const getDaysUntilExpiry = (exp) => {
    if (!exp || exp === '0' || exp === '00000000') return null
    const expStr = exp.toString()
    if (expStr.length === 8) {
      const year = parseInt(expStr.substring(0, 4))
      const month = parseInt(expStr.substring(4, 6)) - 1
      const day = parseInt(expStr.substring(6, 8))
      const expiryDate = new Date(year, month, day)
      const today = new Date()
      const diffTime = expiryDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return null
  }

  // Get table header color based on type
  const getHeaderColor = () => {
    switch (tableType) {
      case 'lowStock':
        return 'bg-destructive'
      case 'expiring':
        return 'bg-orange-600'
      case 'expired':
        return 'bg-red-700'
      default:
        return 'bg-primary'
    }
  }

  // Render table columns based on type
  const renderTableHeaders = () => {
    const headerColor = getHeaderColor()
    const commonHeaders = (
      <>
        <TableHead className={`${headerColor} text-white`}>Code</TableHead>
        <TableHead className={`${headerColor} text-white`}>Product Name</TableHead>
        <TableHead className={`${headerColor} text-white`}>Company</TableHead>
      </>
    )

    if (tableType === 'lowStock') {
      return (
        <>
          {commonHeaders}
          <TableHead className={`text-center ${headerColor} text-white`}>Current Stock</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Stock Status</TableHead>
          <TableHead className={`${headerColor} text-white`}>MRP</TableHead>
          <TableHead className={`${headerColor} text-white`}>P.Rate</TableHead>
          <TableHead className={`text-right ${headerColor} text-white`}>Actions</TableHead>
        </>
      )
    } else if (tableType === 'expiring' || tableType === 'expired') {
      return (
        <>
          {commonHeaders}
          <TableHead className={`${headerColor} text-white`}>Batch No.</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Expiry Date</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>
            {tableType === 'expired' ? 'Days Expired' : 'Days Left'}
          </TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Stock</TableHead>
          <TableHead className={`${headerColor} text-white`}>MRP</TableHead>
          <TableHead className={`text-right ${headerColor} text-white`}>Actions</TableHead>
        </>
      )
    } else {
      // All products
      return (
        <>
          {commonHeaders}
          <TableHead className={`${headerColor} text-white`}>Batch</TableHead>
          <TableHead className={`${headerColor} text-white`}>MRP</TableHead>
          <TableHead className={`${headerColor} text-white`}>Rate</TableHead>
          <TableHead className={`${headerColor} text-white`}>P.Rate</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Stock</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Deal</TableHead>
          <TableHead className={`text-center ${headerColor} text-white`}>Status</TableHead>
          <TableHead className={`text-right ${headerColor} text-white`}>Actions</TableHead>
        </>
      )
    }
  }

  // Render table rows based on type
  const renderTableRow = (product) => {
    const rowBg =
      tableType === 'lowStock'
        ? 'bg-destructive/5'
        : tableType === 'expired'
          ? 'bg-red-50'
          : tableType === 'expiring'
            ? (() => {
                const daysLeft = getDaysUntilExpiry(product.exp)
                const isExpired = daysLeft !== null && daysLeft < 0
                const isCritical = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
                const isWarning = daysLeft !== null && daysLeft > 7 && daysLeft <= 30
                return isExpired
                  ? 'bg-red-50'
                  : isCritical
                    ? 'bg-orange-50'
                    : isWarning
                      ? 'bg-yellow-50'
                      : ''
              })()
            : ''

    if (tableType === 'lowStock') {
      return (
        <TableRow key={product._id} className={rowBg}>
          <TableCell className="font-medium font-mono text-xs">{product.code}</TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              <span className="text-xs text-muted-foreground">
                Batch: {product.curbatch || 'N/A'}
              </span>
            </div>
          </TableCell>
          <TableCell className="text-sm">{product.company || '-'}</TableCell>
          <TableCell className="text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-destructive">
                {Number(product.stock || 0).toFixed(0)}
              </span>
              <span className="text-xs text-muted-foreground">units</span>
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Badge variant="destructive" className="font-semibold">
              {Number(product.stock) <= 0 ? '⚠️ OUT OF STOCK' : '🔴 LOW STOCK'}
            </Badge>
          </TableCell>
          <TableCell className="font-medium">₹{Number(product.MRP || 0).toFixed(2)}</TableCell>
          <TableCell className="font-medium text-blue-600">
            ₹{Number(product.PRate || 0).toFixed(2)}
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
      )
    } else if (tableType === 'expiring' || tableType === 'expired') {
      const daysLeft = getDaysUntilExpiry(product.exp)
      const daysExpiredAbs = daysLeft !== null ? Math.abs(daysLeft) : 0
      const isExpired = daysLeft !== null && daysLeft < 0
      const isCritical = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7

      return (
        <TableRow key={product._id} className={rowBg}>
          <TableCell className="font-medium font-mono text-xs">{product.code}</TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-sm">{product.company || '-'}</TableCell>
          <TableCell className="font-mono text-sm font-semibold">
            {product.curbatch || '-'}
          </TableCell>
          <TableCell className="text-center">
            <span
              className={`font-medium ${isExpired || tableType === 'expired' ? 'text-red-700' : isCritical ? 'text-orange-700' : 'text-orange-600'}`}
            >
              {formatExpiryDate(product.exp)}
            </span>
          </TableCell>
          <TableCell className="text-center">
            {tableType === 'expired' ? (
              <Badge variant="destructive" className="font-semibold">
                ⚠️ {daysExpiredAbs} days ago
              </Badge>
            ) : daysLeft !== null ? (
              <Badge
                variant={isExpired ? 'destructive' : isCritical ? 'destructive' : 'secondary'}
                className="font-semibold"
              >
                {isExpired ? (
                  <>⚠️ EXPIRED</>
                ) : (
                  <>
                    {isCritical ? '🔴' : '⏰'} {daysLeft} days
                  </>
                )}
              </Badge>
            ) : (
              '-'
            )}
          </TableCell>
          <TableCell className="text-center font-medium">
            {Number(product.stock || 0).toFixed(0)}
          </TableCell>
          <TableCell className="font-medium">₹{Number(product.MRP || 0).toFixed(2)}</TableCell>
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
      )
    } else {
      // All products
      return (
        <TableRow key={product._id}>
          <TableCell className="font-medium font-mono text-xs">{product.code}</TableCell>
          <TableCell>
            <div className="flex flex-col">
              <span className="font-medium">{product.name}</span>
              {product.remarks && (
                <span className="text-xs text-muted-foreground">
                  {product.remarks.split(';')[7] || ''}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell className="text-sm">{product.company || '-'}</TableCell>
          <TableCell className="text-xs font-mono">{product.curbatch || '-'}</TableCell>
          <TableCell className="font-medium">₹{Number(product.MRP || 0).toFixed(2)}</TableCell>
          <TableCell>₹{Number(product.Rate || 0).toFixed(2)}</TableCell>
          <TableCell>₹{Number(product.PRate || 0).toFixed(2)}</TableCell>
          <TableCell className="text-center">
            <span
              className={
                Number(product.stock) <= 0
                  ? 'text-red-600 font-bold'
                  : Number(product.stock) <= 10
                    ? 'text-orange-600 font-bold'
                    : 'text-green-600 font-medium'
              }
            >
              {Number(product.stock || 0).toFixed(0)}
            </span>
          </TableCell>
          <TableCell className="text-center">
            {Number(product.Deal) > 0 ? (
              <span className="text-sm font-medium text-blue-600">
                {product.Deal}+{product.Free}
              </span>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </TableCell>
          <TableCell className="text-center">
            <Badge
              variant={
                Number(product.stock) <= 0
                  ? 'destructive'
                  : Number(product.stock) <= 10
                    ? 'secondary'
                    : 'default'
              }
            >
              {Number(product.stock) <= 0
                ? 'Out of Stock'
                : Number(product.stock) <= 10
                  ? 'Low Stock'
                  : 'In Stock'}
            </Badge>
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
      )
    }
  }

  const colSpan = tableType === 'all' ? 11 : tableType === 'lowStock' ? 8 : 9

  return (
    <>
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
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="mrp">MRP</SelectItem>
            <SelectItem value="stock">Stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Sort Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={1}>Ascending</SelectItem>
            <SelectItem value={-1}>Descending</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => fetchProducts()} disabled={loading} variant="outline">
          <IoIosRefresh className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="flex flex-col flex-1 overflow-hidden border">
        <div className="flex-1 overflow-auto relative">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className={`sticky top-0 ${getHeaderColor()} text-white z-10 shadow-sm`}>
                <TableRow>{renderTableHeaders()}</TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={colSpan} className="text-center py-6">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading products...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={colSpan} className="text-center py-6 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => renderTableRow(product))
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
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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

        <ViewProductDialog
          open={viewDialog}
          setOpen={setViewDialog}
          productData={selectedProduct}
        />

        <EditProductDialog
          open={editDialog}
          setOpen={setEditDialog}
          setCategories={setProducts}
          isEdit={true}
          productData={selectedProduct}
        />
      </div>
    </>
  )
}

export default ProductTable
