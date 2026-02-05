import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'
import React from 'react'

function ViewIncomingOrderDialog({ open, setOpen, orderData }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {/* Order Status */}
        <div className="flex items-center gap-3">
          <Badge variant="outline">{orderData?.paymentMethod}</Badge>
          <Badge
            variant={
              orderData?.orderStatus === 'Delivered'
                ? 'success'
                : orderData?.orderStatus === 'Cancelled'
                  ? 'destructive'
                  : 'secondary'
            }
          >
            {orderData?.orderStatus}
          </Badge>
        </div>

        {/* Customer Info */}
        <section className="pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Customer Information</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="Name" value={orderData?.user?.name} />
            <Info label="Phone" value={orderData?.user?.phone} />
            <Info label="Email" value={orderData?.user?.email} />
          </div>
        </section>

        {/* Order Items */}
        <section className="pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Order Items</h3>

          <div className="space-y-1">
            {orderData?.orderItems?.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border p-2">
                <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Code: {item.productCode}</p>
                </div>

                <div className="text-right text-sm">
                  <p>Qty: {item.Quantity}</p>
                  <p className="text-muted-foreground">₹ {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Price Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Info label="Shipping" value={`₹ ${orderData?.shippingPrice}`} />
            <Info label="Discount" value={`₹ ${orderData?.discount}`} />
            <Info
              label="Total Amount"
              value={<span className="font-semibold">₹ {orderData?.totalPrice}</span>}
            />
          </div>
        </section>

        {/* Delivery Address */}
        <section className="pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Delivery Address</h3>

          <div className="border p-3 text-sm text-muted-foreground space-y-1">
            <p>{orderData?.address}</p>
            <p>{orderData?.street}</p>
            <p>
              {orderData?.city}, {orderData?.district}
            </p>
            <p>
              {orderData?.state} – {orderData?.postalCode}
            </p>
            <p>{orderData?.landmark}</p>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ViewIncomingOrderDialog

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-medium truncate">{value || '—'}</div>
    </div>
  )
}
