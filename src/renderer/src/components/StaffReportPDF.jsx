import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'

// ── styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#1e293b', // slate-800
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 40
  },

  // ── Header
  header: { marginBottom: 20 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2pt solid #2563eb', // blue-600
    paddingBottom: 10,
    marginBottom: 10
  },
  companyName: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1e3a8a', letterSpacing: 1 },
  reportTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#475569'
  },
  periodText: { fontSize: 9, color: '#2563eb', marginTop: 2, fontFamily: 'Helvetica-Bold' },
  generatedText: { fontSize: 7, color: '#94a3b8', marginTop: 4 },

  // ── Meta Info
  metaCard: {
    backgroundColor: '#f8fafc', // slate-50
    padding: 12,
    borderRadius: 4,
    border: '1pt solid #e2e8f0', // slate-200
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15
  },
  metaItem: { flexDirection: 'column', gap: 2, minWidth: '45%' },
  metaLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase'
  },
  metaValue: { fontSize: 9, color: '#0f172a', fontFamily: 'Helvetica-Bold' },

  // ── Sections
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #cbd5e1',
    paddingBottom: 4,
    marginBottom: 8,
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#1e293b',
    letterSpacing: 0.5
  },

  // ── Summary Cards
  summaryGrid: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#eff6ff', // blue-50
    padding: 10,
    borderRadius: 4,
    borderLeft: '3pt solid #3b82f6' // blue-500
  },
  summaryCardHighlight: {
    flex: 1,
    backgroundColor: '#fef3c7', // amber-50
    padding: 10,
    borderRadius: 4,
    borderLeft: '3pt solid #f59e0b' // amber-500
  },
  summaryLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold'
  },
  summaryValue: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  summarySubstr: { fontSize: 7, color: '#475569', marginTop: 3 },

  // ── Table
  table: { width: '100%', border: '0.5pt solid #cbd5e1', borderRadius: 2 },
  thead: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottom: '1pt solid #cbd5e1' },
  th: {
    padding: '6 8',
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tr: { flexDirection: 'row', borderBottom: '0.5pt solid #e2e8f0' },
  trAlt: { flexDirection: 'row', backgroundColor: '#f8fafc', borderBottom: '0.5pt solid #e2e8f0' },
  td: { padding: '6 8', fontSize: 8, color: '#334155' },

  // ── Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '1pt solid #e2e8f0',
    paddingTop: 8,
    fontSize: 7,
    color: '#94a3b8'
  }
})

// ── helpers
function fmt(d) {
  return d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'
}
function payMode(code) {
  if (code === '1') return 'Cash'
  if (code === '2') return 'Credit'
  return code ?? '—'
}

// ── PDF Document ─────────────────────────────────────────────────────────────
export default function StaffReportPDF({ staffDetails, orders, monthlyReport, summary, period }) {
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Format best period label
  const bestPeriodLabel = summary?.bestPeriod
    ? summary.mode === 'monthly'
      ? `${summary.bestPeriod.day} ${summary.bestPeriod.monthName}`
      : summary.bestPeriod.monthName
    : '—'

  // Format row period label
  const getRowPeriod = (r) => {
    if (summary?.mode === 'monthly') {
      return `${r.day} ${r.monthName?.slice(0, 3)}`
    }
    return `${r.monthName} ${r.year || ''}`
  }

  // Filter out completely empty rows to save space, unless it's the only data we have
  const hasDataRows = (monthlyReport || []).filter(
    (r) => r.totalOrders > 0 || r.totalOrderValue > 0
  )
  const displayRows = hasDataRows.length > 0 ? hasDataRows : monthlyReport || []

  return (
    <Document title={`Staff Report - ${staffDetails?.name ?? 'Staff'}`} author="DS Pharma">
      <Page size="A4" style={s.page}>
        {/* ── HEADER ────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View>
              <Text style={s.companyName}>DS PHARMA</Text>
              <Text style={s.reportTitle}>STAFF PERFORMANCE REPORT</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.periodText}>{period}</Text>
              <Text style={s.generatedText}>Generated: {generatedAt}</Text>
            </View>
          </View>

          <View style={s.metaCard}>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Staff Name</Text>
              <Text style={s.metaValue}>{staffDetails?.name ?? '—'}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>User ID</Text>
              <Text style={s.metaValue}>{staffDetails?.userId ?? '—'}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Phone</Text>
              <Text style={s.metaValue}>{staffDetails?.phone ?? '—'}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Email</Text>
              <Text style={s.metaValue}>{staffDetails?.email ?? '—'}</Text>
            </View>
          </View>
        </View>

        {/* ── SUMMARY ───────────────────────────────────────────── */}
        {summary && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Performance Summary</Text>
            </View>

            <View style={s.summaryGrid}>
              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Total Orders</Text>
                <Text style={s.summaryValue}>{summary.totalOrders ?? 0}</Text>
                <Text style={s.summarySubstr}>{summary.totalItemsSold ?? 0} Items Sold</Text>
              </View>

              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Total Value</Text>
                <Text style={s.summaryValue}>Rs. {summary.totalOrderValue ?? 0}</Text>
                <Text style={s.summarySubstr}>Total Revenue Generated</Text>
              </View>

              <View style={s.summaryCardHighlight}>
                <Text style={s.summaryLabel}>Best Period</Text>
                <Text style={s.summaryValue}>{bestPeriodLabel}</Text>
                {summary.bestPeriod ? (
                  <Text style={s.summarySubstr}>
                    {summary.bestPeriod.totalOrders} Orders • Rs.{' '}
                    {summary.bestPeriod.totalOrderValue}
                  </Text>
                ) : (
                  <Text style={s.summarySubstr}>No data available</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* ── BREAKDOWN ─────────────────────────────────── */}
        {displayRows.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>
                Breakdown ({summary?.mode === 'monthly' ? 'Daily' : 'Monthly'})
              </Text>
              {hasDataRows.length !== (monthlyReport?.length || 0) && (
                <Text style={{ fontSize: 7, color: '#94a3b8' }}>* Showing active periods only</Text>
              )}
            </View>

            <View style={s.table}>
              <View style={s.thead}>
                <Text style={[s.th, { width: '20%' }]}>Period</Text>
                <Text style={[s.th, { width: '15%', textAlign: 'center' }]}>Orders</Text>
                <Text style={[s.th, { width: '20%', textAlign: 'center' }]}>Items Sold</Text>
                <Text style={[s.th, { width: '25%', textAlign: 'center' }]}>Unique Customers</Text>
                <Text style={[s.th, { width: '20%', textAlign: 'right' }]}>Value (Rs.)</Text>
              </View>

              {displayRows.map((r, i) => (
                <View key={i} style={i % 2 === 0 ? s.tr : s.trAlt}>
                  <Text style={[s.td, { width: '20%', fontFamily: 'Helvetica-Bold' }]}>
                    {getRowPeriod(r)}
                  </Text>
                  <Text style={[s.td, { width: '15%', textAlign: 'center' }]}>{r.totalOrders}</Text>
                  <Text style={[s.td, { width: '20%', textAlign: 'center' }]}>
                    {r.totalItemsSold}
                  </Text>
                  <Text style={[s.td, { width: '25%', textAlign: 'center' }]}>
                    {r.uniqueCustomers}
                  </Text>
                  <Text
                    style={[
                      s.td,
                      { width: '20%', textAlign: 'right', fontFamily: 'Helvetica-Bold' }
                    ]}
                  >
                    {r.totalOrderValue ?? 0}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── ORDERS TABLE ──────────────────────────────────────── */}
        {orders?.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Order List</Text>
              <Text style={{ fontSize: 8, color: '#475569', fontFamily: 'Helvetica-Bold' }}>
                {orders.length} Orders
              </Text>
            </View>

            <View style={s.table}>
              <View style={s.thead}>
                <Text style={[s.th, { width: '16%' }]}>Order No</Text>
                <Text style={[s.th, { width: '28%' }]}>Customer</Text>
                <Text style={[s.th, { width: '20%' }]}>Date</Text>
                <Text style={[s.th, { width: '10%', textAlign: 'center' }]}>Items</Text>
                <Text style={[s.th, { width: '12%', textAlign: 'center' }]}>Mode</Text>
                <Text style={[s.th, { width: '14%', textAlign: 'right' }]}>Value</Text>
              </View>

              {orders.map((o, i) => {
                const pd = o.PaymentDetails
                return (
                  <View key={o._id ?? i} style={i % 2 === 0 ? s.tr : s.trAlt}>
                    <Text
                      style={[
                        s.td,
                        { width: '16%', fontFamily: 'Helvetica-Oblique', color: '#64748b' }
                      ]}
                    >
                      #{o.OrderNo || o.OrderID || '—'}
                    </Text>
                    <Text style={[s.td, { width: '28%', fontFamily: 'Helvetica-Bold' }]}>
                      {o.CustomerDetails?.CustName || '—'}
                    </Text>
                    <Text style={[s.td, { width: '20%' }]}>{fmt(o.createdAt)}</Text>
                    <Text style={[s.td, { width: '10%', textAlign: 'center' }]}>
                      {o.ProductDetails?.length ?? 0}
                    </Text>
                    <Text style={[s.td, { width: '12%', textAlign: 'center' }]}>
                      {payMode(pd?.paymentmode)}
                    </Text>
                    <Text
                      style={[
                        s.td,
                        { width: '14%', textAlign: 'right', fontFamily: 'Helvetica-Bold' }
                      ]}
                    >
                      {pd?.totalInvoiceValue != null ? `${pd.totalInvoiceValue}` : '—'}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        )}

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text>DS Pharma - Confidential Report</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
