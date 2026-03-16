import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { CreditCard } from 'lucide-react'

function InventorySummaryCard({ lowStockProducts, expiredProducts }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Inventory Summary
        </CardTitle>
        <CardDescription>Quick overview of your current inventory health.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg bg-destructive/5 border-destructive/20 space-y-1">
            <p className="text-xs text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-destructive">
              {lowStockProducts?.totalCount ?? '–'}
            </p>
            <p className="text-xs text-muted-foreground">Products below minimum level</p>
          </div>
          <div className="border p-4 rounded-lg bg-orange-50 border-orange-200 space-y-1">
            <p className="text-xs text-muted-foreground">Expiring Products</p>
            <p className="text-2xl font-bold text-orange-600">
              {expiredProducts?.totalCount ?? '–'}
            </p>
            <p className="text-xs text-muted-foreground">Expiring within 90 days</p>
          </div>
          <div className="col-span-2 border p-4 rounded-lg bg-muted/30 space-y-1">
            <p className="text-xs text-muted-foreground">Action Required</p>
            <p className="text-sm font-medium">
              {(lowStockProducts?.totalCount ?? 0) + (expiredProducts?.totalCount ?? 0) > 0
                ? `${(lowStockProducts?.totalCount ?? 0) + (expiredProducts?.totalCount ?? 0)} product(s) need immediate attention.`
                : 'All inventory levels are healthy.'}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <Link to="/staff/inventory">Manage Inventory</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default InventorySummaryCard
