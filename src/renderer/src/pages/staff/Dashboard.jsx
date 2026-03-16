import { outgoingOrderApi, staffApi } from '@/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  AlertTriangle,
  CalendarClock,
  CreditCard,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'

const InventorySummary = lazy(() => import('@/components/InventorySummaryCard'))
const LowStockProducts = lazy(() => import('@/components/LowStockProductCard'))

const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 2021 }, (_, i) => CURRENT_YEAR - i)

function Dashboard() {
  const user = useSelector((state) => state.auth.user)

  console.log('user : ', user)

  const { lowStockProducts, expiredProducts } = useSelector((state) => state.dashboard)

  const [reportMode, setReportMode] = useState('yearly')
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [monthlyReport, setMonthlyReport] = useState([])
  const [summary, setSummary] = useState(null)
  const [loadingReports, setLoadingReports] = useState(false)

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchInvoices = async () => {
    console.log(user._id)
    setLoading(true)
    try {
      const response = await outgoingOrderApi.getOutgoingOrderBySalesId(user._id, {
        page: 1,
        limit: 5
      })

      if (response.success) {
        const data = response.data
        setInvoices(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) fetchInvoices()
  }, [user?._id])

  const MONTH_OPTIONS = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ]

  useEffect(() => {
    if (!user?._id) return
    const fetchReports = async () => {
      setLoadingReports(true)
      try {
        const params =
          reportMode === 'yearly'
            ? { year: selectedYear }
            : { mode: 'monthly', year: selectedYear, month: selectedMonth }

        const res = await staffApi.getStaffReports(user._id, params)

        console.log(res.data)

        // API might return data.report instead of data.monthlyReport based on backend output,
        // use fallback if structure changes.
        setMonthlyReport(res.data?.report || res.data?.monthlyReport || [])
        setSummary(res.data?.summary ?? null)
      } catch (err) {
        console.error('Failed to fetch staff reports', err)
        setMonthlyReport([])
        setSummary(null)
      } finally {
        setLoadingReports(false)
      }
    }
    fetchReports()
  }, [user?._id, reportMode, selectedYear, selectedMonth])

  // Shape data for recharts
  const chartData = monthlyReport.map((r) => ({
    name: reportMode === 'yearly' ? r.monthName?.slice(0, 3) || '' : String(r.day || ''),
    Orders: r.totalOrders ?? 0,
    Value: r.totalOrderValue ?? 0
  }))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Sales Overview Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                {reportMode === 'yearly'
                  ? `Yearly performance for ${selectedYear}.`
                  : `Monthly performance for ${MONTH_OPTIONS.find((m) => m.value === selectedMonth)?.label} ${selectedYear}.`}
              </CardDescription>
            </div>
            {/* Mode / Year / Month selectors */}
            <div className="flex items-center gap-2">
              <select
                value={reportMode}
                onChange={(e) => setReportMode(e.target.value)}
                className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring rounded cursor-pointer"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
              </select>

              {reportMode === 'monthly' && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring rounded cursor-pointer"
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs border border-gray-200 bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring rounded cursor-pointer"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            {loadingReports ? (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading chart…</span>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
                No data available for the selected period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v}
                  />
                  <RechartsTooltip
                    cursor={{
                      stroke: 'hsl(var(--primary))',
                      strokeWidth: 1,
                      strokeDasharray: '3 3'
                    }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Orders"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Value"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>

          {/* Summary strip */}
          {summary && (
            <div className="border-t px-6 py-3 grid grid-cols-3 gap-2">
              {[
                { icon: ShoppingCart, label: 'Total Orders', value: summary.totalOrders },
                { icon: Package, label: 'Items Sold', value: summary.totalItemsSold },
                {
                  icon: TrendingUp,
                  label: 'Order Value',
                  value: `₹${summary.totalOrderValue ?? 0}`
                }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices?.map((sale, index) => (
                <div key={index} className="flex items-center border-b border-gray-400 pb-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {sale?.CustomerDetails?.CustName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {sale?.CustomerDetails?.CustName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sale?.CustomerDetails?.CustMobile}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {sale?.PaymentDetails?.paymentmodeAmount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              {user?.role && <Link to={`/${String(user?.role).toLowerCase()}/invoices`}>View All</Link>}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Inventory Alerts Row */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
        <Suspense
          fallback={
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alerts
                </CardTitle>

                <CardDescription>Medicines running low on inventory.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border p-3 shadow-sm bg-destructive/5 border-destructive/20"
                    >
                      <div className="space-y-2 w-full animate-pulse">
                        {/* Product name */}
                        <div className="h-4 w-40 bg-muted rounded"></div>

                        {/* Stock text */}
                        <div className="h-3 w-28 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          }
        >
          <LowStockProducts
            lowStockProducts={lowStockProducts}
            role={String(user?.role).toLowerCase()}
          />
        </Suspense>

        {/* Inventory Summary Card */}
        <Suspense
          fallback={
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Inventory Summary
                </CardTitle>
                <CardDescription>Quick overview of your current inventory health.</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 animate-pulse">
                  {/* Low Stock Skeleton */}
                  <div className="border p-4 rounded-lg bg-destructive/5 border-destructive/20 space-y-2">
                    <div className="h-3 w-28 bg-muted rounded"></div>
                    <div className="h-7 w-16 bg-muted rounded"></div>
                    <div className="h-3 w-36 bg-muted rounded"></div>
                  </div>

                  {/* Expiring Products Skeleton */}
                  <div className="border p-4 rounded-lg bg-orange-50 border-orange-200 space-y-2">
                    <div className="h-3 w-32 bg-muted rounded"></div>
                    <div className="h-7 w-16 bg-muted rounded"></div>
                    <div className="h-3 w-40 bg-muted rounded"></div>
                  </div>

                  {/* Action Required Skeleton */}
                  <div className="col-span-2 border p-4 rounded-lg bg-muted/30 space-y-2">
                    <div className="h-3 w-28 bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <div className="w-full h-10 bg-muted rounded animate-pulse"></div>
              </CardFooter>
            </Card>
          }
        >
          <InventorySummary lowStockProducts={lowStockProducts} expiredProducts={expiredProducts} />
        </Suspense>
      </div>
    </div>
  )
}

export default Dashboard
