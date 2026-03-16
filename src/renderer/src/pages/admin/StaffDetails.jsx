import { staffApi } from '@/api'
import ExportStaffReportDialog from '@/components/ExportStaffReportDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
  Download,
  Hash,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  XCircle
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

// ── helpers ──────────────────────────────────────────────────────────────
function fmt(d) {
  return d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
}
function fmtDT(d) {
  return d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—'
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="border bg-background px-3 py-2 shadow text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-muted-foreground">
        Orders: <span className="text-foreground font-medium">{payload[0]?.value}</span>
      </p>
      <p className="text-muted-foreground">
        Items: <span className="text-foreground font-medium">{payload[1]?.value}</span>
      </p>
    </div>
  )
}

const PAGE_SIZE = 8

// ── component ─────────────────────────────────────────────────────────────
function StaffDetails() {
  const { staffId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const staffMember = location.state?.staffMember
  const [staffDetails, setStaffDetails] = useState(staffMember || null)
  const [loading, setLoading] = useState(!staffMember)

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [reports, setReports] = useState([])
  const [summary, setSummary] = useState(null)
  const [loadingReports, setLoadingReports] = useState(false)
  const [reportMode, setReportMode] = useState('yearly')
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const currentMonth = new Date().getMonth() + 1
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const yearOptions = Array.from({ length: currentYear - 2021 }, (_, i) => currentYear - i)
  const monthOptions = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' }, { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' }, { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' }, { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' }, { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
  ]

  // fetchers
  const fetchStaffDetails = async () => {
    setLoading(true)
    try {
      const res = await staffApi.getStaffById(staffId)
      setStaffDetails(res.data)
    } catch {
      toast.error('Failed to fetch staff details')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await staffApi.getStaffOrders(staffId)
      setOrders(res.data.orders || [])
    } catch {
      toast.error('Failed to fetch orders')
    } finally {
      setLoadingOrders(false)
    }
  }

  const fetchReports = async (mode, year, month) => {
    setLoadingReports(true)
    try {
      const params = mode === 'yearly' ? { year } : { mode: 'monthly', year, month }
      const res = await staffApi.getStaffReports(staffId, params)
      setReports(res.data.report || [])
      setSummary(res.data.summary || null)
    } catch {
      toast.error('Failed to fetch reports')
    } finally {
      setLoadingReports(false)
    }
  }

  useEffect(() => {
    if (!staffMember) fetchStaffDetails()
    fetchOrders()
  }, [staffId])

  useEffect(() => {
    fetchReports(reportMode, selectedYear, selectedMonth)
  }, [staffId, reportMode, selectedYear, selectedMonth])

  // derived
  const chartData = reports.map((r) => ({
    label: reportMode === 'yearly' ? r.monthName?.slice(0, 3) : String(r.day),
    orders: r.totalOrders,
    items: r.totalItemsSold
  }))

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter(
      (o) =>
        o.OrderNo?.toLowerCase().includes(q) ||
        o.OrderID?.toLowerCase().includes(q) ||
        o.CustomerDetails?.CustName?.toLowerCase().includes(q) ||
        o.CustomerDetails?.Address?.toLowerCase().includes(q)
    )
  }, [orders, search])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const pagedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>
      </div>
    )
  }
  if (!staffDetails) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">Staff member not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const address = [staffDetails.address1, staffDetails.address2, staffDetails.address3]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background px-5 py-4 gap-4">
      {/* ── ROW 1: Chart + Summary ───────────────────────────────── */}
      <div className="flex justify-end">
        <ExportStaffReportDialog staffId={staffId} staffDetails={staffDetails} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Area Chart */}
        <Card className="lg:col-span-2 p-4 border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {reportMode === 'yearly' ? 'Yearly Performance' : 'Monthly Performance'}
            </p>
            <div className="flex items-center gap-2">
              <select
                value={reportMode}
                onChange={(e) => setReportMode(e.target.value)}
                className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
              </select>
              
              {reportMode === 'monthly' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loadingReports ? (
            <div className="flex h-52 items-center justify-center text-sm text-muted-foreground animate-pulse">
              Loading chart…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gItems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<ChartTip />} />
                <Area
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fill="url(#gOrders)"
                  dot={false}
                  activeDot={{ r: 3 }}
                />
                <Area
                  type="monotone"
                  dataKey="items"
                  name="Items"
                  stroke="#22c55e"
                  strokeWidth={1.5}
                  fill="url(#gItems)"
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Summary — single panel, no separate cards */}
        <Card className="p-5 flex flex-col gap-5 border border-gray-200 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Summary
          </p>
          {summary ? (
            <div className="flex flex-col gap-4">
              {[
                { icon: ShoppingCart, label: 'Total Orders', value: summary.totalOrders },
                { icon: Package, label: 'Items Sold', value: summary.totalItemsSold },
                { icon: TrendingUp, label: 'Order Value', value: `₹${summary.totalOrderValue}` },
                {
                  icon: Users,
                  label: 'Unique Customers',
                  value: summary.bestPeriod?.uniqueCustomers ?? 0
                }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </div>
                  <span className="text-sm font-semibold">{value}</span>
                </div>
              ))}

              {summary.bestPeriod && (
                <div className="border-t pt-3 mt-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500" /> Best Period
                  </p>
                  <p className="text-sm font-bold">
                    {reportMode === 'monthly' && summary.bestPeriod.day
                      ? `${summary.bestPeriod.day} ${summary.bestPeriod.monthName}`
                      : summary.bestPeriod.monthName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {summary.bestPeriod.totalOrders} orders · {summary.bestPeriod.uniqueCustomers}{' '}
                    customer
                    {summary.bestPeriod.uniqueCustomers !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </Card>
      </div>

      {/* ── ROW 2: Staff Info + Orders Table ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 flex-1 min-h-0">
        {/* Staff Info — single panel */}
        <Card className="p-5 flex flex-col gap-3 border border-gray-200 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex flex-col">
              <CardTitle className="text-base font-semibold capitalize leading-none">
                {staffDetails.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {staffDetails.email}
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {staffDetails.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
          </CardHeader>

          <div className="flex gap-2">
            <Badge
              variant={staffDetails.role === 'admin' ? 'default' : 'secondary'}
              className="capitalize rounded-none text-xs"
            >
              <Shield className="mr-1 h-3 w-3" /> {staffDetails.role}
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-none text-xs ${staffDetails.isActive ? 'text-green-600 border-green-500' : 'text-red-500 border-red-400'}`}
            >
              {staffDetails.isActive ? (
                <CheckCircle className="mr-1 h-3 w-3" />
              ) : (
                <XCircle className="mr-1 h-3 w-3" />
              )}
              {staffDetails.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="border-t pt-4 flex flex-col gap-4">
            {[
              { icon: Hash, label: 'User ID', value: staffDetails.userId },
              { icon: Phone, label: 'Phone', value: staffDetails.phone },
              { icon: Mail, label: 'Email', value: staffDetails.email },
              { icon: MapPin, label: 'Address', value: address || null },
              { icon: Calendar, label: 'Joined', value: fmt(staffDetails.createdAt) }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Icon className="h-3 w-3" /> {label}
                </span>
                <span className="text-sm">
                  {value || (
                    <span className="italic text-muted-foreground/50 text-xs">Not provided</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Orders Table */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-md flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b">
            <p className="text-sm font-semibold">
              Orders{' '}
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredOrders.length})
              </span>
            </p>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search orders…"
                className="pl-8 h-8 text-xs rounded-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {loadingOrders ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground animate-pulse">
                Loading orders…
              </div>
            ) : pagedOrders.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                {search ? 'No matching orders' : 'No orders found'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs bg-muted/40">
                    <TableHead className="text-xs">Order No</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Address</TableHead>
                    <TableHead className="text-xs text-center">Items</TableHead>
                    <TableHead className="text-xs text-right">Invoice</TableHead>
                    <TableHead className="text-xs text-right">Mode</TableHead>
                    <TableHead className="text-xs text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedOrders.map((order) => {
                    const pd = order.PaymentDetails
                    const invoice = pd?.totalInvoiceValue
                    const mode =
                      pd?.paymentmode === '1'
                        ? 'Cash'
                        : pd?.paymentmode === '2'
                          ? 'Credit'
                          : (pd?.paymentmode ?? '—')
                    return (
                      <TableRow key={order._id} className="text-xs">
                        <TableCell className="font-mono text-muted-foreground">
                          #{order.OrderNo || order.OrderID}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.CustomerDetails?.CustName || '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-28 truncate">
                          {order.CustomerDetails?.Address || '—'}
                        </TableCell>
                        <TableCell className="text-center">
                          {order.ProductDetails?.length ?? 0}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {invoice != null ? `₹${invoice}` : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="rounded-none text-xs px-1.5 py-0">
                            {mode}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {fmtDT(order.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-2">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-none"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-none"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StaffDetails
