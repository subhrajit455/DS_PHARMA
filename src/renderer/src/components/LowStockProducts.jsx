import { productApi } from '@/api'
import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Eye, Pencil } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

function LowStockProducts() {
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [lowStockPagination, setLowStockPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expiringSoon: 0,
    expired: 0,
    totalValue: 0
  })

  const fetchLowStockProducts = async () => {
    setLoading(true)
    try {
      const response = await productApi.getLowStockProducts({
        page: lowStockPagination.page,
        limit: lowStockPagination.limit
      })
      if (response.success) {
        setLowStockProducts(response.data.lowStockProducts || [])
        setLowStockPagination({
          page: response.data.currentPage || 1,
          limit: lowStockPagination.limit,
          total: response.data.totalProducts || 0,
          totalPages: response.data.totalPages || 0
        })
        setStats((prev) => ({
          ...prev,
          lowStock: response.data.totalProducts || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLowStockProducts()
  }, [lowStockPagination.page, lowStockPagination.limit])

  const handleLowStockPageChange = (page) => {
    setLowStockPagination((prev) => ({ ...prev, page }))
  }

  const handleLowStockLimitChange = (limit) => {
    setLowStockPagination((prev) => ({ ...prev, limit, page: 1 }))
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden border">
      <div className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-destructive text-white z-10 shadow-sm">
              <TableRow>
                <TableHead className="bg-destructive text-white">Code</TableHead>
                <TableHead className="bg-destructive text-white">Product Name</TableHead>
                <TableHead className="bg-destructive text-white">Company</TableHead>
                <TableHead className="text-center bg-destructive text-white">
                  Current Stock
                </TableHead>
                <TableHead className="text-center bg-destructive text-white">
                  Stock Status
                </TableHead>
                <TableHead className="bg-destructive text-white">MRP</TableHead>
                <TableHead className="bg-destructive text-white">P.Rate</TableHead>
                <TableHead className="text-right bg-destructive text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading low stock products...
                    </div>
                  </TableCell>
                </TableRow>
              ) : lowStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No low stock products found
                  </TableCell>
                </TableRow>
              ) : (
                lowStockProducts.map((product) => (
                  <TableRow key={product._id} className="bg-destructive/5">
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
                    <TableCell className="font-medium">
                      ₹{Number(product.MRP || 0).toFixed(2)}
                    </TableCell>
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
          <Select
            value={lowStockPagination.limit.toString()}
            onValueChange={handleLowStockLimitChange}
          >
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
            Showing {(lowStockPagination.page - 1) * lowStockPagination.limit + 1} to{' '}
            {Math.min(lowStockPagination.page * lowStockPagination.limit, lowStockPagination.total)}{' '}
            of {lowStockPagination.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLowStockPageChange(lowStockPagination.page - 1)}
            disabled={lowStockPagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm">
            Page {lowStockPagination.page} of {lowStockPagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLowStockPageChange(lowStockPagination.page + 1)}
            disabled={lowStockPagination.page >= lowStockPagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default LowStockProducts
