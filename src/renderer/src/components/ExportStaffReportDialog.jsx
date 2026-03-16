import { staffApi } from '@/api'
import StaffReportPDF from '@/components/StaffReportPDF'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { pdf } from '@react-pdf/renderer'
import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i)

export default function ExportStaffReportDialog({ staffId, staffDetails }) {
  const [open, setOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedYear, setSelectedYear] = useState(String(CURRENT_YEAR))
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportingType, setExportingType] = useState(null) // 'pdf', 'excel', or null

  const handleExport = async (type = 'pdf') => {
    let ordersParams = { all: true }
    let reportParams = {}
    let period = ''

    if (isCustomRange) {
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates')
        return
      }
      ordersParams.startDate = startDate
      ordersParams.endDate = endDate
      reportParams = { mode: 'custom', startDate, endDate }
      period = `${startDate} to ${endDate}`
    } else {
      if (!selectedYear) {
        toast.error('Please select a year')
        return
      }
      ordersParams.year = selectedYear

      if (selectedMonth && selectedMonth !== 'all') {
        const monthIndex = MONTHS.indexOf(selectedMonth) + 1
        ordersParams.month = monthIndex
        reportParams = { mode: 'monthly', year: selectedYear, month: monthIndex }
        period = `${selectedMonth} ${selectedYear}`
      } else {
        reportParams = { mode: 'yearly', year: selectedYear }
        period = `Year ${selectedYear}`
      }
    }

    setExportingType(type)
    try {
      // Fetch orders filtered by criteria
      const ordersRes = await staffApi.getStaffOrders(staffId, ordersParams)
      const orders = ordersRes.data?.orders ?? []

      // Fetch report data based on mode
      const reportsRes = await staffApi.getStaffReports(staffId, reportParams)
      const reportRows = reportsRes.data?.report ?? []
      const summary = reportsRes.data?.summary ?? null

      const getRowPeriod = (r) => {
        if (summary?.mode === 'monthly') {
          return `${r.day} ${r.monthName?.slice(0, 3)}`
        }
        return `${r.monthName} ${r.year || ''}`
      }

      if (type === 'pdf') {
        // Generate PDF blob and trigger download
        const blob = await pdf(
          <StaffReportPDF
            staffDetails={staffDetails}
            orders={orders}
            monthlyReport={reportRows}
            summary={summary}
            period={period}
          />
        ).toBlob()

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `staff-report-${staffDetails?.name?.replace(/\s+/g, '-') ?? staffId}-${period.replace(/\s+/g, '-')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      } else if (type === 'excel') {
        const wb = XLSX.utils.book_new()
        const sheetData = []

        // ===== 1. COMPANY HEADER =====
        sheetData.push(['DS PHARMA'])
        sheetData.push(['STAFF PERFORMANCE REPORT'])
        sheetData.push([`Period: ${period}`])
        sheetData.push([])

        // ===== 2. STAFF DETAILS =====
        sheetData.push(['STAFF DETAILS'])
        sheetData.push([
          'Staff Name:', staffDetails?.name ?? '—',
          'Phone:', staffDetails?.phone ?? '—',
          'Email:', staffDetails?.email ?? '—'
        ])
        sheetData.push([])

        // ===== 3. ORDERS TABLE =====
        const ordersHeaderRow = sheetData.length
        sheetData.push(['ORDERS LIST'])
        sheetData.push(['Order No', 'Customer', 'Date', 'Items', 'Payment Mode', 'Invoice Value (Rs.)'])

        if (orders?.length) {
          orders.forEach((o) => {
            const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'

            const mode =
              o.PaymentDetails?.paymentmode === '1'
                ? 'Cash'
                : o.PaymentDetails?.paymentmode === '2'
                  ? 'Credit'
                  : '—'

            sheetData.push([
              o.OrderNo || o.OrderID || '—',
              o.CustomerDetails?.CustName || '—',
              dateStr,
              o.ProductDetails?.length ?? 0,
              mode,
              o.PaymentDetails?.totalInvoiceValue ?? 0
            ])
          })
        } else {
          sheetData.push(['No orders found for this period'])
        }

        sheetData.push([])

        // ===== 4. PERFORMANCE SUMMARY =====
        const summaryRow = sheetData.length
        sheetData.push(['PERFORMANCE SUMMARY'])
        sheetData.push([
          'Total Orders:', summary?.totalOrders ?? 0,
          'Items Sold:', summary?.totalItemsSold ?? 0,
          'Total Value:', summary?.totalOrderValue ?? 0,
          'Unique Customers:', summary?.bestPeriod?.uniqueCustomers ?? 0
        ])

        const bestPeriodLabel = summary?.bestPeriod
          ? summary.mode === 'monthly'
            ? `${summary.bestPeriod.day} ${summary.bestPeriod.monthName}`
            : summary.bestPeriod.monthName
          : '—'

        sheetData.push([
          'Best Period:', bestPeriodLabel
        ])

        // ===== CREATE SHEET =====
        const ws = XLSX.utils.aoa_to_sheet(sheetData)

        // Column widths
        ws['!cols'] = [
          { wch: 16 }, // A: Order No / Staff Name label
          { wch: 28 }, // B: Customer / Name value
          { wch: 14 }, // C: Date / User ID label
          { wch: 14 }, // D: Items / User ID value
          { wch: 16 }, // E: Mode / Phone label
          { wch: 18 }, // F: Value / Phone value
          { wch: 12 }, // G: Email label / Summary label
          { wch: 26 }  // H: Email value / Summary value
        ]

        // ===== MERGES =====
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Company name
          { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Report title
          { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // Period

          { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } }, // Staff details title
          { s: { r: ordersHeaderRow, c: 0 }, e: { r: ordersHeaderRow, c: 7 } }, // Orders title
          { s: { r: summaryRow, c: 0 }, e: { r: summaryRow, c: 7 } }, // Summary title
          { s: { r: summaryRow + 2, c: 1 }, e: { r: summaryRow + 2, c: 3 } } // Best Period span
        ]

        // ===== APPEND =====
        XLSX.utils.book_append_sheet(wb, ws, 'Report')

        // ===== DOWNLOAD =====
        XLSX.writeFile(
          wb,
          `staff-report-${staffDetails?.name?.replace(/\s+/g, '-') ?? staffId}-${period.replace(/\s+/g, '-')}.xlsx`
        )
      }

      toast.success(`${type === 'pdf' ? 'PDF' : 'Excel'} downloaded`)
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(`Failed to generate ${type.toUpperCase()}`)
    } finally {
      setExportingType(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-none text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Staff Report</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-3">
          <div className="flex items-center justify-between border-b pb-3">
            <Label
              className="font-semibold cursor-pointer"
              onClick={() => setIsCustomRange(!isCustomRange)}
            >
              Custom Date Range
            </Label>
            <Switch
              checked={isCustomRange}
              onCheckedChange={(v) => {
                setIsCustomRange(v)
                if (!v) {
                  setStartDate('')
                  setEndDate('')
                }
              }}
            />
          </div>

          {isCustomRange ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5 cursor-pointer">
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="date"
                  className="h-9 text-sm w-full block"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-1.5 cursor-pointer">
                <Label className="text-xs">End Date</Label>
                <Input
                  type="date"
                  className="h-9 text-sm w-full block"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Month</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="All Months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={!!exportingType}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={!!exportingType}
            className="gap-1.5"
          >
            {exportingType === 'excel' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download Excel
              </>
            )}
          </Button>
          <Button
            onClick={() => handleExport('pdf')}
            disabled={!!exportingType}
            className="gap-1.5"
          >
            {exportingType === 'pdf' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
