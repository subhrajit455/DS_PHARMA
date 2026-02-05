import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'
import React from 'react'

function ViewCustomerDialog({ open, setOpen, customerData }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details – {customerData?.name}</DialogTitle>
        </DialogHeader>

        {/* Basic Info */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Basic Information</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="Customer Code" value={customerData?.code} />
            <Info label="Ledger Code" value={customerData?.LedgerCode} />
            <Info label="Area" value={customerData?.area} />
            <Info label="Phone" value={customerData?.phone1} />
            <Info label="Email" value={customerData?.email1} />
            <Info
              label="Status"
              value={
                customerData?.is_deleted === 0 ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )
              }
            />
          </div>
        </section>

        {/* Regulatory Info */}
        <section className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Regulatory Details</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="GSTIN" value={customerData?.GSTIN || customerData?.gstn} />
            <Info label="Drug License" value={customerData?.DlNo || customerData?.dlNo} />
            <Info label="Marg Code" value={customerData?.MargCode} />
          </div>
        </section>

        {/* Financial Info */}
        <section className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Financial Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="Opening Balance" value={`₹ ${customerData?.opening}`} />
            <Info label="Current Balance" value={`₹ ${customerData?.balance}`} />
            <Info label="PDC Amount" value={`₹ ${customerData?.pdc}`} />
          </div>
        </section>

        {/* Address */}
        <section className="space-y-2 pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground">Address</h3>

          <p className="text-sm p-3 text-muted-foreground">{customerData?.address || '—'}</p>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ViewCustomerDialog

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium truncate">{value || '—'}</div>
    </div>
  )
}
