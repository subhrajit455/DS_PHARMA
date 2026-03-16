import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function ViewInvoiceDialog({ open, setOpen, invoiceData }) {
  if (!invoiceData) return null

  const customer = invoiceData.CustomerDetails || {}
  const products = invoiceData.ProductDetails || []
  const payment = invoiceData.PaymentDetails || {}
  const gstType = payment.gstType // 'igst' | 'cgst_sgst'

  const paymentLabel =
    payment.paymentmode === '1'
      ? 'Cash'
      : payment.paymentmode === '2'
        ? 'Card'
        : payment.paymentmode === '3'
          ? 'Online'
          : payment.paymentmode || '—'

  // Summary figures — prefer stored values, fallback to computed
  const totalAmount = parseFloat(payment.totalAmount || 0)
  const totalDisc = parseFloat(payment.totalDiscountAmount || 0)
  const totalTax = parseFloat(payment.totalTaxAmount || 0)
  const totalInvoiceValue = parseFloat(payment.totalInvoiceValue || 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto space-y-5">
        <DialogHeader>
          <DialogTitle>
            Order #{invoiceData.OrderID}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              No. {invoiceData.OrderNo} · {new Date(invoiceData.createdAt).toLocaleString()}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Customer Details */}
        <section>
          <SectionTitle>Customer Details</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm p-3 bg-muted/40 rounded">
            <Info label="Name" value={customer.CustName} />
            <Info label="Mobile" value={customer.CustMobile} />
            <Info label="Customer ID" value={customer.CustomerID} />
            <Info label="Address" value={customer.Address} />
            <Info
              label="Ship Address"
              value={[customer.shipAdd1, customer.shipAdd2, customer.shipAdd3]
                .map((s) => s?.trim())
                .filter(Boolean)
                .join(', ')}
            />
            <Info label="Ship Name" value={customer.shipname} />
            {customer.order_remarks && (
              <div className="col-span-full space-y-0.5">
                <p className="text-xs text-muted-foreground">Order Remarks</p>
                <p className="font-medium">{customer.order_remarks}</p>
              </div>
            )}
          </div>
        </section>

        {/* Products Table */}
        <section>
          <SectionTitle>Products ({products.length})</SectionTitle>
          <div className="border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty + Fr.</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>HSN</TableHead>
                  {/* <TableHead className="text-right">MRP</TableHead> */}
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Disc.</TableHead>
                  <TableHead className="text-right">SGST</TableHead>
                  <TableHead className="text-right">CGST</TableHead>
                  <TableHead className="text-right">IGST</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p, i) => {
                  const net =
                    parseFloat(p.Rate || 0) * parseFloat(p.Quantity || 0) -
                    parseFloat(p.DiscAmt || 0)
                  return (
                    <TableRow key={p._id || i}>
                      <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.code}</div>
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        {p.Quantity} + {p.FreeQty || 0}
                      </TableCell>
                      <TableCell className="text-xs">{p.company || '—'}</TableCell>
                      <TableCell className="text-xs">{p.curbatch || '—'}</TableCell>
                      <TableCell className="text-xs">
                        {p.exp ? `${p.exp.slice(0, 4)}-${p.exp.slice(4, 6)}` : '—'}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.hsn || p.hsnDetails?.hsnCode || '—'}
                      </TableCell>
                      {/* <TableCell className="text-right text-xs">
                        ₹{parseFloat(p.MRP || 0).toFixed(2)}
                      </TableCell> */}
                      <TableCell className="text-right text-xs">
                        {parseFloat(p.Rate || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {parseFloat(p.DiscAmt || 0) > 0
                          ? `${parseFloat(p.DiscAmt).toFixed(2)}`
                          : '0.00'}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {invoiceData.PaymentDetails.gstType !== 'igst'
                          ? (p.taxRate / 2).toFixed(2)
                          : '0.00'}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {invoiceData.PaymentDetails.gstType !== 'igst'
                          ? (p.taxRate / 2).toFixed(2)
                          : '0.00'}
                      </TableCell>
                      <TableCell className="text-right text-xs">
                        {invoiceData.PaymentDetails.gstType === 'igst'
                          ? p.taxRate.toFixed(2)
                          : '0.00'}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {(Number(p.Rate || 0) + Number(p.taxAmount || 0)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Payment Breakdown */}
        <section>
          <SectionTitle>Payment Summary</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left — payment mode */}
            <div className="p-3 bg-muted/40 space-y-2 text-sm">
              <Info label="Payment Mode" value={paymentLabel} />
              {payment.paymentmodeAmount && payment.paymentmodeAmount !== '0' && (
                <Info label="Amount Paid" value={`₹${payment.paymentmodeAmount}`} />
              )}
              {payment.payment_remarks && <Info label="Remarks" value={payment.payment_remarks} />}
              <Info
                label="GST Type"
                value={
                  gstType === 'igst'
                    ? 'IGST (Inter-state)'
                    : gstType === 'cgst_sgst'
                      ? 'CGST + SGST (Intra-state)'
                      : '—'
                }
              />
            </div>

            {/* Right — billing-style totals breakdown */}
            <div className="p-3 border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total MRP Amount:</span>
                <span className="font-medium">{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Discount:</span>
                <span className="font-medium text-red-600">-{totalDisc.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                {gstType === 'igst' ? (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IGST:</span>
                    <span className="font-medium text-blue-600">+{totalTax.toFixed(2)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        CGST ({((totalTax / totalAmount) * 50).toFixed(1)}%):
                      </span>
                      <span className="font-medium text-blue-600">
                        +{(totalTax / 2).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        SGST ({((totalTax / totalAmount) * 50).toFixed(1)}%):
                      </span>
                      <span className="font-medium text-blue-600">
                        +{(totalTax / 2).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transport:</span>
                <span className="font-medium">{parseFloat(invoiceData.PaymentDetails.Transport || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery:</span>
                <span className="font-medium">{parseFloat(invoiceData.PaymentDetails.Delivery || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total Invoice Value:</span>
                <span className="text-primary">{totalInvoiceValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

function SectionTitle({ children }) {
  return (
    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {children}
    </h4>
  )
}

function Info({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value || '—'}</p>
    </div>
  )
}
