import { dashboardApi, productApi } from '@/api'
import EditProductDialog from '@/components/EditProductDialog'
import ProductTable from '@/components/ProductTable'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ViewProductDialog from '@/components/ViewProductDialog'
import {
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Package,
  Pencil,
  Search,
  TrendingUp,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('all')
  const [products, setProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [expiringProducts, setExpiringProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expiringSoon: 0,
    expired: 0,
    totalValue: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [lowStockPagination, setLowStockPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [expiringPagination, setExpiringPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('name')
  const [sortOrder, setSortOrder] = useState(1)
  const [stockStatus, setStockStatus] = useState(1)
  const [expiryDays, setExpiryDays] = useState(30)

  const [editDialog, setEditDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewDialog, setViewDialog] = useState(false)

  // Analytics data
  const [stockTrends, setStockTrends] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])

  const fetchProducts = async () => {
    setLoading(true)
    toast.loading('Fetching Products...')
    try {
      const response = await productApi.getAllProducts({
        page: pagination.page,
        limit: pagination.limit,
        query,
        sortBy: sort,
        order: sortOrder,
        stock: stockStatus,
        is_deleted: 0
      })

      if (response.success) {
        const data = response.data
        toast.dismiss()
        toast.success(response.message)

        setProducts(data.products || [])
        setPagination({
          page: data.page,
          limit: data.limit,
          total: data.totalProducts,
          totalPages: data.totalPages
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

  const fetchExpiringProducts = async () => {
    setLoading(true)
    try {
      const response = await productApi.getExpiringProducts({
        days: expiryDays,
        page: expiringPagination.page,
        limit: expiringPagination.limit
      })
      if (response.success) {
        setExpiringProducts(response.data.expiringProducts || [])
        setExpiringPagination({
          page: response.data.currentPage || 1,
          limit: expiringPagination.limit,
          total: response.data.totalProducts || 0,
          totalPages: response.data.totalPages || 0
        })
        setStats((prev) => ({
          ...prev,
          expiringSoon: response.data.totalProducts || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching expiring products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchExpiredProducts = async () => {
    setLoading(true)
    try {
      const response = await productApi.getExpiredProducts({
        page: expiringPagination.page,
        limit: expiringPagination.limit
      })
      if (response.success) {
        setExpiringProducts(response.data.expiringProducts || [])
        setExpiringPagination({
          page: response.data.currentPage || 1,
          limit: expiringPagination.limit,
          total: response.data.totalProducts || 0,
          totalPages: response.data.totalPages || 0
        })
        setStats((prev) => ({
          ...prev,
          expiringSoon: response.data.totalProducts || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching expiring products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalyticsData = async () => {
    try {
      // Mock data for now - replace with actual API calls when backend is ready
      setStockTrends([
        { date: '2026-01-01', avgStock: 450, lowStockItems: 12 },
        { date: '2026-01-15', avgStock: 420, lowStockItems: 18 },
        { date: '2026-02-01', avgStock: 380, lowStockItems: 24 },
        { date: '2026-02-10', avgStock: 350, lowStockItems: 28 }
      ])

      setCategoryDistribution([
        { name: 'Antibiotics', value: 8 },
        { name: 'Pain Relief', value: 12 },
        { name: 'Vitamins', value: 5 },
        { name: 'Antiseptics', value: 3 },
        { name: 'Others', value: 6 }
      ])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const [products, lowStockProducts, expiringProducts, expiredProducts] = await Promise.all([
        productApi.getAllProducts(),
        productApi.getLowStockProducts(),
        productApi.getExpiringProducts(),
        productApi.getExpiredProducts()
      ])

      console.log({
        products,
        lowStockProducts,
        expiringProducts
      })

      setStats({
        totalProducts: products.data.totalProducts,
        lowStockProducts: lowStockProducts.data.totalProducts,
        expiringProducts: expiringProducts.data.totalProducts,
        expiredProducts: expiredProducts.data.totalProducts
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden px-6 py-4 gap-4">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 shrink-0">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('all')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">All products in inventory</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('low-stock')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Below minimum level</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setActiveTab('expiring')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Past expiry date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="shrink-0">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* All Products Tab */}
        <TabsContent value="all" className="flex flex-col flex-1 overflow-hidden gap-4 mt-4">
          <ProductTable apiFn={productApi.getAllProducts} tableType="all" />
        </TabsContent>

        {/* Low Stock Tab */}
        <TabsContent value="low-stock" className="flex flex-col flex-1 overflow-hidden gap-4 mt-4">
          <ProductTable apiFn={productApi.getLowStockProducts} tableType="lowStock" />
        </TabsContent>

        {/* Expiring Soon Tab */}
        <TabsContent value="expiring" className="flex flex-col flex-1 overflow-hidden gap-4 mt-4">
          <ProductTable
            apiFn={productApi.getExpiringProducts}
            tableType="expiring"
            apiParams={{ days: 30 }}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex flex-col flex-1 overflow-auto gap-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stock Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stock Level Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stockTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgStock" stroke="#3b82f6" name="Avg Stock" />
                    <Line
                      type="monotone"
                      dataKey="lowStockItems"
                      stroke="#ef4444"
                      name="Low Stock Items"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Low Stock by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Placeholder for more charts */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Inventory Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground text-center py-8">
                  Additional analytics charts will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
