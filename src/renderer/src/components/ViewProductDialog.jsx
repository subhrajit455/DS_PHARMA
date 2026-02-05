import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

function ViewProductDialog({ open, setOpen, productData }) {
  if (!productData) return null

  const {
    name,
    code,
    company,
    stock,
    MRP,
    Rate,
    PRate,
    Deal,
    Free,
    curbatch,
    exp,
    images = [],
    isFeatured,
    categoryDetails
  } = productData

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {name}
            {isFeatured && <Badge>Featured</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              {images.length > 0 ? (
                images.map((img) => (
                  <img
                    key={img.fileId}
                    src={img.url}
                    alt={img.name}
                    className="h-32 w-full object-cover"
                  />
                ))
              ) : (
                <div className="h-32 col-span-2 flex items-center justify-center text-muted-foreground">
                  <img
                    src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    alt="placeholder"
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info label="Product Code" value={code} />
              <Info label="Company" value={company} />
              <Info label="Category" value={categoryDetails?.name || '-'} />
              <Info
                label="Stock"
                value={stock}
                valueClass={
                  Number(stock) <= 0
                    ? 'text-red-600 font-medium'
                    : Number(stock) <= 10
                      ? 'text-orange-600 font-medium'
                      : 'text-green-600 font-medium'
                }
              />
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-sm">
              <Info label="MRP" value={`₹${Number(MRP).toFixed(2)}`} />
              <Info label="Rate" value={`₹${Number(Rate).toFixed(2)}`} />
              <Info label="Purchase Rate" value={`₹${Number(PRate).toFixed(2)}`} />
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-sm">
              <Info label="Scheme" value={Deal > 0 ? `${Deal} + ${Free}` : '-'} />
              <Info label="Batch" value={curbatch || '-'} />
              <Info
                label="Expiry"
                value={
                  exp
                    ? new Date(
                        `${exp.slice(0, 4)}-${exp.slice(4, 6)}-${exp.slice(6, 8)}`
                      ).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : '-'
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Info({ label, value, valueClass = '' }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-medium ${valueClass}`}>{value || '-'}</p>
    </div>
  )
}

export default ViewProductDialog
