import CustomerSearchComponent from '@/components/CustomerSearchComponent'
import ProductSearchComponent from '@/components/ProductSearchComponent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { generateOrderId } from '@/config/generateOrderId'
import {
  CreditCard,
  Package,
  Printer,
  Receipt,
  Save,
  ShoppingCart,
  Trash2,
  Truck
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function Billing() {
  // Order Information (Marg API Format)
  const [orderData, setOrderData] = useState({
    OrderID: generateOrderId(),
    OrderNo: '',
    CustomerID: '',
    Margid: '',
    Type: 'S',
    Sid: '',
    ProductCode: '',
    Quantity: '',
    Free: '',
    Lat: '',
    Lng: '',
    Address: '',
    GpsID: '',
    UserType: 1,
    Points: 0,
    Discounts: 0,
    Transport: '',
    Delivery: '',
    BankName: '',
    BankAdd1: '',
    BankAdd2: '',
    ShipName: '',
    ShipAdd1: '',
    ShipAdd2: '',
    ShipAdd3: '',
    PaymentMode: '',
    PaymentmodeAmount: 0,
    Payment_remarks: '',
    Order_remarks: '',
    CustMobile: '',
    CompanyCode: 'MARGLIVE',
    OrderFrom: 'MARGLIVE'
  })

  // Auto-generate Order ID when component mounts
  useEffect(() => {
    const newOrderId = generateOrderId()
    setOrderData((prev) => ({ ...prev, OrderID: newOrderId }))
  }, [])

  const [billItems, setBillItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleOrderChange = (e) => {
    const { name, value } = e.target
    setOrderData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle customer selection and auto-fill details
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)

    if (customer) {
      setOrderData((prev) => ({
        ...prev,
        CustomerID: customer.rid || '',
        CustMobile: customer.phone1 || '',
        CustomerGST: customer.GSTIN || '',
        ShipName: customer.name || '',
        ShipAdd1: customer.address || '',
        ShipAdd2: customer.area || '',
        ShipAdd3: customer.city || ''
      }))
    } else {
      setOrderData((prev) => ({
        ...prev,
        CustomerID: '',
        CustMobile: '',
        ShipName: '',
        ShipAdd1: '',
        ShipAdd2: '',
        ShipAdd3: '',
        CustomerGST: ''
      }))
    }
  }

  // Calculate free quantity based on Deal (e.g., "10" means buy 10 get 1 free)
  const calculateFreeQuantity = (quantity, deal, free) => {
    const dealQty = parseInt(deal) || 0
    const freeQty = parseInt(free) || 0

    if (dealQty > 0 && freeQty > 0) {
      // Calculate how many complete deal sets are purchased
      const dealSets = Math.floor(quantity / dealQty)
      return dealSets * freeQty
    }
    return 0
  }

  // Calculate discount based on MRP and Rate
  const calculateDiscount = (mrp, rate, quantity) => {
    const discountPerUnit = Math.max(0, mrp - rate)
    const discountPercentage = mrp > 0 ? (discountPerUnit / mrp) * 100 : 0
    const totalDiscountAmount = discountPerUnit * quantity
    return {
      Disc: parseFloat(discountPercentage.toFixed(2)),
      DiscAmt: parseFloat(totalDiscountAmount.toFixed(2))
    }
  }

  const addItemToBill = (product) => {
    const existingItem = billItems.find((item) => item.code === product.code)

    if (existingItem) {
      const newQuantity = existingItem.Quantity + 1
      const freeQty = calculateFreeQuantity(newQuantity, existingItem.Deal, existingItem.Free)
      const discount = calculateDiscount(existingItem.MRP, existingItem.Rate, newQuantity)

      setBillItems(
        billItems.map((item) =>
          item.code === product.code
            ? { ...item, Quantity: newQuantity, FreeQuantity: freeQty, ...discount }
            : item
        )
      )
    } else {
      // Convert string values to numbers and use MRP if Rate is 0
      const mrp = parseFloat(product.MRP) || 0
      const rate = parseFloat(product.Rate) || mrp
      const deal = parseInt(product.Deal) || 0
      const free = parseInt(product.Free) || 0
      const freeQty = calculateFreeQuantity(1, deal, free)
      const discount = calculateDiscount(mrp, rate, 1)

      setBillItems([
        ...billItems,
        {
          ...product,
          Quantity: 1,
          Deal: deal,
          Free: free,
          FreeQuantity: freeQty,
          Rate: rate,
          MRP: mrp,
          PRate: parseFloat(product.PRate) || 0,
          ...discount
        }
      ])
    }
    toast.success(`${product.name} added to bill`)
  }

  const updateQuantity = (code, Quantity) => {
    if (Quantity <= 0) {
      removeItem(code)
      return
    }
    setBillItems(
      billItems.map((item) => {
        if (item.code === code) {
          const newQty = parseInt(Quantity)
          const freeQty = calculateFreeQuantity(newQty, item.Deal, item.Free)
          const discount = calculateDiscount(item.MRP, item.Rate, newQty)
          return { ...item, Quantity: newQty, FreeQuantity: freeQty, ...discount }
        }
        return item
      })
    )
  }

  const removeItem = (code) => {
    if (confirm('Are you sure you want to remove this item?')) {
      setBillItems(billItems.filter((item) => item.code !== code))
      toast.success('Item removed from bill')
    }
  }

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => sum + item.Rate * item.Quantity, 0)
  }

  const calculateTotalDiscount = () => {
    return billItems.reduce((sum, item) => sum + (item.DiscAmt || 0), 0)
  }

  const calculateTotal = () => {
    return (
      calculateSubtotal() -
      calculateTotalDiscount() -
      orderData.Discounts +
      parseFloat(orderData.Transport || 0) +
      parseFloat(orderData.Delivery || 0)
    )
  }

  const handleSubmitBill = async (e) => {
    e.preventDefault()

    if (!orderData.CustomerID) {
      toast.error('Please select a customer')
      return
    }

    if (billItems.length === 0) {
      toast.error('Please add items to the bill')
      return
    }

    // Prepare data in Marg API format matching the documentation
    const margOrderData = {
      OrderID: orderData.OrderID,
      OrderNo: orderData.OrderNo || '',
      CustomerID: orderData.CustomerID,
      Margid: orderData.Margid || '',
      Type: orderData.Type || 'S',
      Sid: orderData.Sid || '',
      ProductCode: billItems.map((item) => item.code).join(','), // All product codes
      Quantity: billItems.reduce((sum, item) => sum + item.Quantity, 0), // Total quantity
      Free: billItems.reduce((sum, item) => sum + (item.FreeQuantity || 0), 0), // Total free items
      Lat: orderData.Lat || '',
      Lng: orderData.Lng || '',
      Address: orderData.Address || '',
      GpsID: orderData.GpsID || '',
      UserType: orderData.UserType || 1,
      Points: parseFloat(orderData.Points) || 0,
      Discounts: parseFloat(orderData.Discounts) || 0,
      Transport: parseFloat(orderData.Transport) || 0,
      Delivery: parseFloat(orderData.Delivery) || 0,
      BankName: orderData.BankName || '',
      BankAdd1: orderData.BankAdd1 || '',
      BankAdd2: orderData.BankAdd2 || '',
      ShipName: orderData.ShipName || '',
      ShipAdd1: orderData.ShipAdd1 || '',
      ShipAdd2: orderData.ShipAdd2 || '',
      ShipAdd3: orderData.ShipAdd3 || '',
      PaymentMode: orderData.PaymentMode || '',
      PaymentmodeAmount: calculateTotal(), // Total amount as payment amount
      Payment_remarks: orderData.Payment_remarks || '',
      Order_remarks: orderData.Order_remarks || '',
      CustMobile: orderData.CustMobile || '',
      CompanyCode: orderData.CompanyCode || 'MARGLIVE',
      OrderFrom: orderData.OrderFrom || 'MARGLIVE'
    }

    const response = await axios.post(orderUrl.createOrder, margOrderData)
    console.log('Marg Order Response:', response)

    if (response.data.success) {
      toast.success('Bill created successfully!')
      const newOrderId = generateOrderId()
      setOrderData({
        OrderID: newOrderId,
        OrderNo: '',
        CustomerID: '',
        Margid: '',
        Type: 'S',
        Sid: '',
        ProductCode: '',
        Quantity: '',
        Free: '',
        Lat: '',
        Lng: '',
        Address: '',
        GpsID: '',
        UserType: 1,
        Points: 0,
        Discounts: 0,
        Transport: '',
        Delivery: '',
        BankName: '',
        BankAdd1: '',
        BankAdd2: '',
        ShipName: '',
        ShipAdd1: '',
        ShipAdd2: '',
        ShipAdd3: '',
        PaymentMode: '',
        PaymentmodeAmount: 0,
        Payment_remarks: '',
        Order_remarks: '',
        CustMobile: '',
        CompanyCode: 'MARGLIVE',
        OrderFrom: 'MARGLIVE'
      })

      setBillItems([])
      setSelectedCustomer(null)
      setSelectedProduct(null)
    } else {
      toast.error('Failed to create bill')
    }
  }

  const handlePrint = () => {
    toast.success('Printing bill...')
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Bill - ORD-{orderData.OrderID}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSubmitBill}>
            <Save className="h-4 w-4" />
            Save Bill
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmitBill} className="space-y-2">
        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Select Customer <span className="text-red-500">*</span>
              </label>
              <CustomerSearchComponent
                onCustomerSelect={handleCustomerSelect}
                selectedCustomer={selectedCustomer}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer ID</label>
                <Input
                  name="CustomerID"
                  value={orderData.CustomerID}
                  placeholder="Auto-filled from customer"
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Mobile</label>
                <Input
                  name="CustMobile"
                  value={orderData.CustMobile}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Customer GST</label>
                <Input
                  name="CustomerGST"
                  value={orderData.CustomerGST || ''}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Add Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSearchComponent
              onProductSelect={(product) => {
                addItemToBill(product)
              }}
              selectedProduct={selectedProduct}
            />
            <div className="mt-4">
              {billItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added to bill yet. Search and add products above.
                </div>
              ) : (
                <div className="border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Code</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Deal</TableHead>
                        <TableHead>Free</TableHead>
                        <TableHead>Disc Amt</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItems.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.name}</span>
                              {item.company && (
                                <span className="text-xs text-muted-foreground">
                                  {item.company}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            ₹{(item.MRP || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.Rate}
                              onChange={(e) => {
                                const newRate = parseFloat(e.target.value) || 0
                                const discount = calculateDiscount(item.MRP, newRate, item.Quantity)
                                setBillItems(
                                  billItems.map((i) =>
                                    i.code === item.code ? { ...i, Rate: newRate, ...discount } : i
                                  )
                                )
                              }}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.Quantity}
                              onChange={(e) => updateQuantity(item.code, e.target.value)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {item.Deal > 0 ? (
                              <span className="text-sm font-medium text-blue-600">
                                {item.Deal}+{item.Free}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.FreeQuantity > 0 ? (
                              <span className="text-sm font-semibold text-green-600">
                                {item.FreeQuantity}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-red-600 font-medium">
                                ₹{(item.DiscAmt || 0).toFixed(2)}
                              </span>
                              {item.Disc > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ({item.Disc.toFixed(2)}%)
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{((item.Rate || 0) * item.Quantity - (item.DiscAmt || 0)).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.code)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Bank Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipping & Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Shipping Address</h4>
                <div className="space-y-2">
                  <Textarea
                    name="ShipAddr"
                    value={orderData.ShipAddr}
                    onChange={handleOrderChange}
                    placeholder="Address line 1"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="ShipAddr2"
                    value={orderData.ShipAddr2}
                    onChange={handleOrderChange}
                    placeholder="Address line 2"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="ShipAddr3"
                    value={orderData.ShipAddr3}
                    onChange={handleOrderChange}
                    placeholder="Address line 3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bank Details</h4>
                <div className="space-y-2">
                  <Input
                    name="BankName"
                    value={orderData.BankName}
                    onChange={handleOrderChange}
                    placeholder="Bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="BankAddr"
                    value={orderData.BankAddr}
                    onChange={handleOrderChange}
                    placeholder="Bank address line 1"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="BankAddr2"
                    value={orderData.BankAddr2}
                    onChange={handleOrderChange}
                    placeholder="Bank address line 2"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment, Delivery & Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment, Delivery & Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Payment & Charges */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm border-b pb-2">Payment Details</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Mode</label>
                  <select
                    name="PaymentMode"
                    value={orderData.PaymentMode}
                    onChange={handleOrderChange}
                    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="O">Cash (O)</option>
                    <option value="R">Card (R)</option>
                    <option value="">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Points</label>
                  <Input
                    name="Points"
                    type="number"
                    step="0.01"
                    value={orderData.Points}
                    onChange={handleOrderChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Discount</label>
                  <Input
                    name="Discounts"
                    type="number"
                    step="0.01"
                    value={orderData.Discounts}
                    onChange={handleOrderChange}
                    placeholder="0.00"
                  />
                </div>

                <h4 className="font-medium text-sm border-b pb-2 pt-2">Delivery & Transport</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transport Charges</label>
                  <Input
                    name="Transport"
                    type="number"
                    step="0.01"
                    value={orderData.Transport}
                    onChange={handleOrderChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Charges</label>
                  <Input
                    name="Delivery"
                    type="number"
                    step="0.01"
                    value={orderData.Delivery}
                    onChange={handleOrderChange}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Right Column - Remarks & Summary */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm border-b pb-2">Remarks</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Remarks</label>
                  <Textarea
                    name="Payment_remarks"
                    value={orderData.Payment_remarks}
                    onChange={handleOrderChange}
                    placeholder="Payment remarks"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Remarks</label>
                  <Textarea
                    name="Order_remarks"
                    value={orderData.Order_remarks}
                    onChange={handleOrderChange}
                    placeholder="Order remarks"
                    rows={2}
                  />
                </div>

                <h4 className="font-medium text-sm border-b pb-2 pt-2">Bill Summary</h4>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Item Discounts:</span>
                    <span className="font-medium text-red-600">
                      -₹{calculateTotalDiscount().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Discount:</span>
                    <span className="font-medium text-red-600">
                      -₹{parseFloat(orderData.Discounts || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transport:</span>
                    <span className="font-medium">
                      ₹{parseFloat(orderData.Transport || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-medium">
                      ₹{parseFloat(orderData.Delivery || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default Billing
