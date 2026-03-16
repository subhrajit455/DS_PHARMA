import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Constants ────────────────────────────────────────────────────────────────
const FIRM = {
  name: 'D.S.PHARMA',
  phone: '9382713623 / 9564200437',
  address1: 'BERACHAPA HAROA ROAD NORTH 24 PARGANA',
  address2: '19-WEST BENGAL',
  email: 'dscommunication3@gmail.com',
  gstin: '19BANPS7259D2Z2',
  dlNo: 'WB/PGN/BIO/NBO/W592389',
  foodLic: '22821013004262'
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 7.5,
    color: '#000',
    paddingTop: 18,
    paddingBottom: 36,
    paddingHorizontal: 24
  },

  // ─ Header ─
  headerRow: { flexDirection: 'row', borderWidth: 1, borderColor: '#000' },
  headerLeft: { flex: 1, padding: 5, borderRightWidth: 1, borderRightColor: '#000' },
  headerCenter: {
    flex: 1.2,
    padding: 5,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000'
  },
  headerRight: { flex: 1, padding: 5, alignItems: 'flex-end' },
  firmName: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  billTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 1 },
  tiny: { fontSize: 6.5 },
  bold: { fontFamily: 'Helvetica-Bold' },

  // ─ Customer + Order meta ─
  metaRow: { flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: '#000' },
  metaLeft: { flex: 1.5, padding: 5, borderRightWidth: 1, borderRightColor: '#000' },
  metaRight: { flex: 1, padding: 5 },
  metaLabel: { fontSize: 6.5, fontFamily: 'Helvetica-Bold' },
  metaVal: { fontSize: 7.5 },
  metaRow2: { flexDirection: 'row', marginTop: 2 },
  metaKey: { fontSize: 7, fontFamily: 'Helvetica-Bold', width: 70 },
  metaData: { fontSize: 7 },

  // ─ Product Table ─
  table: { borderWidth: 1, borderTopWidth: 0, borderColor: '#000' },
  tHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#e0e0e0',
    minHeight: 12
  },
  tRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bbb',
    minHeight: 10
  },
  tRowLast: { flexDirection: 'row', minHeight: 15 },
  th: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', padding: 2 },
  td: { fontSize: 7, padding: 2 },

  // col widths
  cName: { flex: 2.6, borderRightWidth: 0.5, borderRightColor: '#000' },
  cQty: { width: 36, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'center' },
  cMRP: { width: 38, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'right' },
  cBatch: { width: 48, borderRightWidth: 0.5, borderRightColor: '#000' },
  cExp: { width: 36, borderRightWidth: 0.5, borderRightColor: '#000' },
  cRate: { width: 40, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'right' },
  cDis: { width: 26, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'right' },
  cSGST: { width: 28, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'right' },
  cCGST: { width: 28, borderRightWidth: 0.5, borderRightColor: '#000', textAlign: 'right' },
  cAmt: { width: 46, textAlign: 'right' },

  // ─ Footer summary ─
  footerRow: { flexDirection: 'row', borderWidth: 1, borderTopWidth: 0, borderColor: '#000' },
  gstTable: { flex: 1.4, borderRightWidth: 1, borderRightColor: '#000' },
  gstHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#e0e0e0'
  },
  gstRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#bbb' },
  gstCell: { flex: 1, fontSize: 6.5, padding: 2, borderRightWidth: 0.5, borderRightColor: '#bbb' },
  gstCellLast: { flex: 1, fontSize: 6.5, padding: 2 },
  totalsBox: { flex: 1, padding: 4 },
  totalLine: { flexDirection: 'row', marginBottom: 2 },
  totalKey: { flex: 1, fontSize: 7, fontFamily: 'Helvetica-Bold' },
  totalVal: { fontSize: 7, fontFamily: 'Helvetica-Bold' },
  grandKey: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold' },
  grandVal: { fontSize: 8, fontFamily: 'Helvetica-Bold' },

  // ─ Bottom strip ─
  bottomStrip: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#000',
    flexDirection: 'row',
    padding: 5
  },
  bottomCell: { flex: 1, borderRightWidth: 0.5, borderRightColor: '#000', paddingRight: 6 },
  bottomCellLast: { flex: 1 },

  // ─ Page footer ─
  pageFooter: {
    position: 'absolute',
    bottom: 14,
    left: 24,
    right: 24,
    borderTopWidth: 0.5,
    borderTopColor: '#000',
    paddingTop: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pageFooterText: { fontSize: 6.5 }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt2 = (n) => parseFloat(n || 0).toFixed(2)
const payLabel = (m) =>
  m === '1' ? 'CASH' : m === '2' ? 'CREDIT' : m === '3' ? 'ONLINE' : m || '—'
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—'
const fmtExp = (exp) => {
  if (!exp || exp.length < 6) return '—'
  return `${exp.slice(4, 6)}/${exp.slice(0, 4)}`
}

// Compute GST breakdown rows from product list
function buildGSTRows(products) {
  const map = {}
  for (const p of products) {
    // parse GST % from remarks: format "T;sgst;cgst;..."
    const parts = (p.remarks || '').split(';')
    const sgstPct = parseFloat(parts[1] || 0)
    const cgstPct = parseFloat(parts[2] || 0)
    const gstPct = sgstPct + cgstPct // e.g. 5
    const key = gstPct.toFixed(0)
    const qty = parseFloat(p.Quantity || 0)
    const rate = parseFloat(p.Rate || 0)
    const mrp = parseFloat(p.MRP || 0)
    const lineTotal = rate * qty
    const sgst = (lineTotal * sgstPct) / 100
    const cgst = (lineTotal * cgstPct) / 100
    if (!map[key]) map[key] = { gst: gstPct, total: 0, disc: 0, sgst: 0, cgst: 0 }
    map[key].total += lineTotal
    map[key].sgst += sgst
    map[key].cgst += cgst
  }
  return Object.values(map).sort((a, b) => a.gst - b.gst)
}

// ─── PDF Document ─────────────────────────────────────────────────────────────
function OrderDocument({ order }) {
  const customer = order.CustomerDetails || {}
  const products = order.ProductDetails || []
  const payment = order.PaymentDetails || {}
  const gstType = payment.gstType // 'igst' | 'cgst_sgst'

  // Use stored totals from PaymentDetails
  const totalAmount = parseFloat(payment.totalAmount || 0)
  const totalDisc = parseFloat(payment.totalDiscountAmount || 0)
  const totalTax = parseFloat(payment.totalTaxAmount || 0)
  const totalInvoiceValue = parseFloat(payment.totalInvoiceValue || 0)

  const shipAddr = [customer.shipAdd1, customer.shipAdd2, customer.shipAdd3]
    .map((a) => a?.trim())
    .filter(Boolean)
    .join(', ')

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ══ HEADER ══ */}
        <View style={s.headerRow}>
          {/* Left – contact */}
          <View style={s.headerLeft}>
            <Text style={[s.tiny]}>Phone : {FIRM.phone}</Text>
            <Text style={[s.tiny, { marginTop: 2 }]}>{FIRM.address1}</Text>
            <Text style={s.tiny}>{FIRM.address2}</Text>
            <Text style={s.tiny}>E-Mail : {FIRM.email}</Text>
          </View>

          {/* Center – firm name + title */}
          <View style={s.headerCenter}>
            <Text style={s.billTitle}>GOODS RECEIPT NOTE ESTIMATE</Text>
            <Text style={s.firmName}>{FIRM.name}</Text>
          </View>

          {/* Right – GSTIN etc */}
          <View style={s.headerRight}>
            <Text style={s.tiny}>Original for Buyer</Text>
            <Text style={[s.tiny, { marginTop: 4 }]}>GSTIN : {FIRM.gstin}</Text>
            <Text style={s.tiny}>D.L.No. : {FIRM.dlNo}</Text>
            <Text style={s.tiny}>Food Lic No. : {FIRM.foodLic}</Text>
          </View>
        </View>

        {/* ══ CUSTOMER + ORDER META ══ */}
        <View style={s.metaRow}>
          {/* Left – customer */}
          <View style={s.metaLeft}>
            <Text style={[s.metaVal, s.bold]}>{customer.CustName || '—'}</Text>
            {shipAddr ? <Text style={s.metaVal}>{shipAddr}</Text> : null}
            {customer.Address ? <Text style={s.metaVal}>{customer.Address}</Text> : null}
            {customer.CustMobile ? (
              <Text style={s.metaVal}>Ph No. : {customer.CustMobile}</Text>
            ) : null}
            <Text style={s.metaVal}>Customer ID : {customer.CustomerID || '—'}</Text>
          </View>

          {/* Right – order info */}
          <View style={s.metaRight}>
            <View style={s.metaRow2}>
              <Text style={s.metaKey}>G.Rcpt. No.</Text>
              <Text style={s.metaData}>: {order.OrderID || '—'}</Text>
            </View>
            <View style={s.metaRow2}>
              <Text style={s.metaKey}>Date</Text>
              <Text style={s.metaData}>: {fmtDate(order.createdAt)}</Text>
            </View>
            <View style={s.metaRow2}>
              <Text style={s.metaKey}>Order No.</Text>
              <Text style={s.metaData}>: {order.OrderNo || '—'}</Text>
            </View>
            <View style={s.metaRow2}>
              <Text style={s.metaKey}>Sales Mode</Text>
              <Text style={[s.metaData, s.bold]}>: {payLabel(payment.paymentmode)}</Text>
            </View>
            {/* <View style={s.metaRow2}>
              <Text style={s.metaKey}>GST Type</Text>
              <Text style={s.metaData}>
                : {gstType === 'igst' ? 'IGST' : gstType === 'cgst_sgst' ? 'CGST+SGST' : '—'}
              </Text>
            </View>*/}
            <View style={s.metaRow2}>
              <Text style={s.metaKey}>Sales Man</Text>
              <Text style={s.metaData}>: {order.Sid.name || '—'}</Text>
            </View>
          </View>
        </View>

        {/* ══ PRODUCT TABLE ══ */}
        <View style={s.table}>
          {/* Header */}
          <View style={s.tHead}>
            <View style={s.cName}>
              <Text style={s.th}>Product With Packing</Text>
            </View>
            <View style={s.cQty}>
              <Text style={[s.th, { textAlign: 'center' }]}>Qty+Fr.</Text>
            </View>
            <View style={s.cBatch}>
              <Text style={s.th}>Batch</Text>
            </View>
            <View style={s.cExp}>
              <Text style={s.th}>Exp.</Text>
            </View>
            <View style={{ width: 34, borderRightWidth: 0.5, borderRightColor: '#000' }}>
              <Text style={s.th}>HSN</Text>
            </View>
            <View style={s.cRate}>
              <Text style={[s.th, { textAlign: 'right' }]}>Rate</Text>
            </View>
            <View style={s.cDis}>
              <Text style={[s.th, { textAlign: 'right' }]}>Disc.</Text>
            </View>
            {gstType !== 'igst' ? (
              <>
                <View style={s.cSGST}>
                  <Text style={[s.th, { textAlign: 'right' }]}>SGST</Text>
                </View>
                <View style={s.cCGST}>
                  <Text style={[s.th, { textAlign: 'right' }]}>CGST</Text>
                </View>
              </>
            ) : (
              <View style={{ width: 38, borderRightWidth: 0.5, borderRightColor: '#000' }}>
                <Text style={[s.th, { textAlign: 'right' }]}>IGST</Text>
              </View>
            )}
            <View style={s.cAmt}>
              <Text style={[s.th, { textAlign: 'right' }]}>Amount</Text>
            </View>
          </View>

          {/* Rows */}
          {products.map((p, i) => {
            const qty = parseFloat(p.Quantity || 0)
            const rate = parseFloat(p.Rate || 0)
            const discAmt = parseFloat(p.DiscAmt || 0)
            const taxRate = parseFloat(p.taxRate || 0)
            const halfRate = (taxRate / 2).toFixed(2)
            const lineAmt = rate * qty - discAmt
            const isLast = i === products.length - 1
            return (
              <View key={p._id || i} style={isLast ? s.tRowLast : s.tRow}>
                <View style={s.cName}>
                  <Text style={s.td}>{p.name}</Text>
                </View>
                <View style={s.cQty}>
                  <Text style={[s.td, { textAlign: 'center' }]}>
                    {p.Quantity}+{p.FreeQuantity || p.Free || '0'}
                  </Text>
                </View>
                <View style={s.cBatch}>
                  <Text style={s.td}>{p.curbatch || '—'}</Text>
                </View>
                <View style={s.cExp}>
                  <Text style={s.td}>{fmtExp(p.exp)}</Text>
                </View>
                <View style={{ width: 34, borderRightWidth: 0.5, borderRightColor: '#000' }}>
                  <Text style={s.td}>{p.hsn || p.hsnDetails?.hsnCode || '—'}</Text>
                </View>
                <View style={s.cRate}>
                  <Text style={[s.td, { textAlign: 'right' }]}>{fmt2(rate)}</Text>
                </View>
                <View style={s.cDis}>
                  <Text style={[s.td, { textAlign: 'right' }]}>{fmt2(discAmt)}</Text>
                </View>
                {gstType !== 'igst' ? (
                  <>
                    <View style={s.cSGST}>
                      <Text style={[s.td, { textAlign: 'right' }]}>{halfRate}</Text>
                    </View>
                    <View style={s.cCGST}>
                      <Text style={[s.td, { textAlign: 'right' }]}>{halfRate}</Text>
                    </View>
                  </>
                ) : (
                  <View style={{ width: 38, borderRightWidth: 0.5, borderRightColor: '#000' }}>
                    <Text style={[s.td, { textAlign: 'right' }]}>{taxRate.toFixed(2)}</Text>
                  </View>
                )}
                <View style={s.cAmt}>
                  <Text style={[s.td, { textAlign: 'right' }]}>
                    {(Number(p.Rate || 0) + Number(p.taxAmount || 0)).toFixed(2)}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>

        {/* ══ FOOTER – TOTALS ══ */}
        <View style={s.footerRow}>
          {/* Left spacer (empty GST table area) */}
          <View style={s.gstTable} />

          {/* Totals box */}
          <View style={s.totalsBox}>
            <View style={s.totalLine}>
              <Text style={s.totalKey}>TOTAL AMOUNT</Text>
              <Text style={s.totalVal}>{fmt2(totalAmount)}</Text>
            </View>
            <View style={s.totalLine}>
              <Text style={s.totalKey}>DISCOUNT</Text>
              <Text style={s.totalVal}>-{fmt2(totalDisc)}</Text>
            </View>
            {gstType === 'igst' ? (
              <View style={s.totalLine}>
                <Text style={s.totalKey}>IGST</Text>
                <Text style={s.totalVal}>+{fmt2(totalTax)}</Text>
              </View>
            ) : (
              <>
                <View style={s.totalLine}>
                  <Text style={s.totalKey}>CGST</Text>
                  <Text style={s.totalVal}>+{fmt2(totalTax / 2)}</Text>
                </View>
                <View style={s.totalLine}>
                  <Text style={s.totalKey}>SGST</Text>
                  <Text style={s.totalVal}>+{fmt2(totalTax / 2)}</Text>
                </View>
              </>
            )}
            <View style={s.totalLine}>
              <Text style={s.totalKey}>ROUND OFF</Text>
              <Text style={s.totalVal}>0.00</Text>
            </View>
            <View
              style={[
                s.totalLine,
                { borderTopWidth: 1, borderTopColor: '#000', paddingTop: 3, marginTop: 2 }
              ]}
            >
              <Text style={s.grandKey}>GRAND TOTAL</Text>
              <Text style={s.grandVal}>{fmt2(totalInvoiceValue)}</Text>
            </View>
          </View>
        </View>

        {/* ══ BOTTOM STRIP ══ */}
        <View style={s.bottomStrip}>
          <View style={s.bottomCell}>
            <Text style={[s.tiny, s.bold]}>No. Of Item</Text>
            <Text style={s.tiny}>{products.length}</Text>
          </View>
          <View style={s.bottomCell}>
            <Text style={[s.tiny, s.bold]}>Outstanding</Text>
            <Text style={s.tiny}>{fmt2(payment.paymentmodeAmount)}</Text>
          </View>
          <View style={s.bottomCell}>
            <Text style={[s.tiny, s.bold]}>Receiver Signature</Text>
            <Text
              style={{ marginTop: 18, borderTopWidth: 0.5, borderTopColor: '#000', fontSize: 6.5 }}
            >
              {' '}
            </Text>
          </View>
          <View style={s.bottomCellLast}>
            <Text style={[s.tiny, s.bold]}>For {FIRM.name}</Text>
            <Text
              style={{ marginTop: 18, borderTopWidth: 0.5, borderTopColor: '#000', fontSize: 6.5 }}
            >
              Authorised Signatory
            </Text>
          </View>
        </View>

        {/* remarks */}
        {customer.order_remarks ? (
          <View style={{ padding: 4, borderWidth: 1, borderTopWidth: 0, borderColor: '#000' }}>
            <Text style={s.tiny}>Remarks : {customer.order_remarks}</Text>
          </View>
        ) : null}

        {/* ══ PAGE FOOTER ══ */}
        <View style={s.pageFooter} fixed>
          <Text style={s.pageFooterText}>
            {FIRM.name} — Computer generated document. All disputes subject to Jurisdiction only.
          </Text>
          <Text style={s.pageFooterText}>Printed: {new Date().toLocaleDateString('en-IN')}</Text>
        </View>
      </Page>
    </Document>
  )
}

// ─── Export: Download Button ───────────────────────────────────────────────────
export function OrderPDFButton({ order }) {
  const fileName = `Order_${order.OrderID || order._id}.pdf`
  return (
    <PDFDownloadLink document={<OrderDocument order={order} />} fileName={fileName}>
      {({ loading }) => (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          title="Download PDF"
          disabled={loading}
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </PDFDownloadLink>
  )
}

export default OrderDocument
