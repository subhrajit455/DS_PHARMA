import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Mail, User, Phone, Calendar } from 'lucide-react'

function ViewStaffDialog({ open, setOpen, staffData }) {
  if (!staffData) return null

  const { name, email, phone, role, createdAt, status } = staffData

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Staff Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{name}</h3>
              <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                {status || 'Active'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="space-y-4">
            <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={email} />
            <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={phone || '-'} />
            <InfoItem icon={<User className="h-4 w-4" />} label="Role" value={role || '-'} />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Join Date"
              value={createdAt || '-'}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-sm break-all">{value}</p>
      </div>
    </div>
  )
}

export default ViewStaffDialog
