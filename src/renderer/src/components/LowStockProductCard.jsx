import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router'

function LowStockProductCard({ lowStockProducts, role }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Low Stock Alerts
        </CardTitle>
        <CardDescription>Medicines running low on inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lowStockProducts?.loading ? (
            [1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-3 shadow-sm bg-destructive/5 border-destructive/20 animate-pulse"
              >
                <div className="space-y-2 w-full">
                  <div className="h-4 w-40 bg-muted rounded"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : lowStockProducts?.error ? (
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-destructive">{lowStockProducts?.error}</span>
            </div>
          ) : (
            lowStockProducts?.products &&
            lowStockProducts.products.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-3 shadow-sm bg-destructive/5 border-destructive/20"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Current Stock: <span className="font-bold text-destructive">{item.stock}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          {role && <Link to={`/${role}/inventory`}>View All</Link>}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default LowStockProductCard
