import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import React from 'react'

function ViewCustomerDialog({ open, setOpen, customerData }) {
  if (!customerData) return null

  const clean = (val) => val?.toString().trim() || '—'

  const lastPart = customerData?.address?.trim().split(/\s+/).at(-1)
  const extractedPhone =
    lastPart && /^\d{10}$/.test(lastPart)
      ? lastPart
      : customerData?.phone1 || customerData?.phone2 || customerData?.phone3 || '—'

  const isActive = customerData?.Is_Deleted === '0'

  const formatCurrency = (num) => `₹ ${Number(num || 0).toLocaleString('en-IN')}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-3xl max-h-[85vh] overflow-y-auto p-6">
        {/* Header */}
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-semibold">{clean(customerData.name)}</DialogTitle>
          <p className="text-sm text-muted-foreground">Customer Code: {clean(customerData.code)}</p>
        </DialogHeader>

        <Separator className="my-2" />

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Grid>
            <Info label="Ledger Code" value={clean(customerData.LedgerCode)} />
            <Info label="Area" value={clean(customerData.area)} />
            <Info label="Phone" value={extractedPhone} />
            <Info label="Email" value={clean(customerData.email1)} />
            <Info
              label="Status"
              value={
                <Badge variant={isActive ? 'success' : 'destructive'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>
              }
            />
          </Grid>
        </Section>

        {/* REGULATORY */}
        <Section title="Regulatory Details">
          <Grid>
            <Info label="GSTIN" value={clean(customerData.GSTIN)} />
            <Info label="Drug License" value={clean(customerData.DlNo)} />
            <Info label="Marg Code" value={clean(customerData.MargCode)} />
          </Grid>
        </Section>

        {/* FINANCIAL */}
        <Section title="Financial Summary">
          <Grid>
            <Info
              label="Opening Balance"
              value={
                <span className="font-semibold">
                  {formatCurrency(customerData.opening)}
                </span>
              }
            />
            <Info
              label="Current Balance"
              value={
                <span className="font-semibold">
                  {formatCurrency(customerData.balance)}
                </span>
              }
            />
            <Info
              label="PDC Amount"
              value={
                <span className="font-semibold">
                  {formatCurrency(customerData.pdc)}
                </span>
              }
            />
          </Grid>
        </Section>

        {/* ADDRESS */}
        <Section title="Address">
          <div className="bg-muted/40 p-4 rounded-lg text-sm leading-relaxed">
            {clean(customerData.address)}
          </div>
        </Section>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCustomerDialog

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
  return (
    <section className="space-y-3 mb-3">
      <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
        {title}
      </h3>
      {children}
    </section>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{children}</div>
}

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium text-sm wrap-break-word">{value || '—'}</div>
    </div>
  )
}
