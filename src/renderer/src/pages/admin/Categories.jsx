import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categoryUrl } from '@/config'
import axios from 'axios'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    hidden: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get(categoryUrl.getPaginatedCategories, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          query
        }
      })

      const data = response.data.data
      setCategories(data.categories || [])
      setPagination({
        page: data.currentPage,
        limit: pagination.limit,
        total: data.totalCategories,
        totalPages: data.totalPages
      })

      // Calculate stats
      const active = data.categories.filter((cat) => cat.visibility).length
      const hidden = data.categories.filter((cat) => !cat.visibility).length

      setStats({
        total: data.totalCategories,
        active: active,
        hidden: hidden
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
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

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await axios.delete(`${categoryUrl.deleteCategory}/${categoryId}`)

      if (response.data.success) {
        toast.success(response.data.message)
        fetchCategories()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden p-8 pt-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button>
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 shrink-0">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Visible on store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.hidden}</div>
            <p className="text-xs text-muted-foreground">Not visible</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={() => fetchCategories()} disabled={loading} variant="outline">
            <IoIosRefresh className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden shadow-lg">
                <div className="relative h-32 bg-muted animate-pulse">
                  <div className="absolute top-1.5 right-1.5 h-4 w-10 rounded-sm bg-muted-foreground/30" />
                </div>

                <div className="p-2 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/30 animate-pulse" />

                  <div className="h-3 w-1/3 rounded bg-muted-foreground/20 animate-pulse" />

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <div className="h-7 w-7 rounded bg-muted-foreground/30 animate-pulse" />
                      <div className="h-7 w-7 rounded bg-muted-foreground/30 animate-pulse" />
                    </div>

                    <div className="h-7 w-7 rounded bg-muted-foreground/30 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center flex-1 text-muted-foreground">
            No categories found
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto p-1">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="group overflow-hidden shadow-lg transition-all"
                  >
                    <div className="relative h-32 overflow-hidden bg-muted">
                      <img
                        src={category.images[0]?.url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Status Badge */}
                      <Badge
                        className={`absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5 ${
                          category.visibility ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                        {category.visibility ? 'Active' : 'Hidden'}
                      </Badge>
                    </div>

                    <div className="p-2">
                      <h3
                        className="font-semibold text-sm truncate capitalize"
                        title={category.name}
                      >
                        {category.name}
                      </h3>

                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(category.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t">
                        <div className="flex gap-0.5">
                          <Button
                            title="Edit"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-blue-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            title={category.visibility ? 'Hide' : 'Show'}
                            size="icon"
                            variant="ghost"
                            className={`h-7 w-7 ${
                              category.visibility ? 'text-gray-600' : 'text-green-600'
                            }`}
                          >
                            {category.visibility ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>

                        <Button
                          title="Delete"
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-600"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-2 border-t shrink-0 bg-background">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="96">96</SelectItem>
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
        )}
      </div>
    </div>
  )
}

export default Categories
