import { createHsnCode, incomingOrderApi, outgoingOrderApi, productApi } from '@/api'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { generateOrderId } from '@/config/generateOrderId'
import { CreditCard, Package, Printer, Receipt, Save, ShoppingCart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoIosRefresh } from 'react-icons/io'
import { RxReset } from 'react-icons/rx'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import CreatableSelect from 'react-select/creatable'

function Billing() {
  const { id } = useParams()
  const salesId = useSelector((state) => state.auth.user._id) || localStorage.getItem('salerId')
  const hsnCodes = useSelector((state) => state.hsn.hsnCodes)

  console.log(salesId)

  const [orderData, setOrderData] = useState({
    OrderID: generateOrderId(),
    OrderNo: generateOrderId(),
    CustomerID: '',
    ProductCode: '',
    Quantity: '',
    Free: '',
    Lat: '',
    Lng: '',
    Address: '',
    GpsID: '0',
    UserType: '1',
    Points: '0.00',
    Discounts: '0',
    Transport: '',
    Delivery: '',
    BankName: '',
    BankAdd1: '',
    BankAdd2: '',
    ShipName: '',
    ShipAdd1: '',
    ShipAdd2: '',
    ShipAdd3: '',
    PaymentMode: '1',
    PaymentModeAmount: '0',
    PaymentRemarks: '',
    OrderRemarks: '',
    CustMobile: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [billItems, setBillItems] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hsnOptions, setHsnOptions] = useState([])
  // 'igst' = inter-state (Central), 'cgst_sgst' = intra-state (State)
  const [gstType, setGstType] = useState('igst')

  useEffect(() => {
    let mounted = true

    if (mounted) {
      const opts = hsnCodes.map((h) => ({
        label: h.hsnCode + ' (GST ' + h.taxRate + '%)',
        value: h.hsnCode,
        taxRate: h.taxRate
      }))
      setHsnOptions(opts)
    }

    return () => {
      mounted = false
    }
  }, [hsnCodes])

  const fetchIncomingOrderDetails = async () => {
    setIsLoading(true)
    try {
      const response = await incomingOrderApi.getIncomingOrderById(id)
      console.log('Full API Response:', response)
      return response
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate Order ID when component mounts
  useEffect(() => {
    const newOrderId = generateOrderId()
    setOrderData((prev) => ({ ...prev, OrderID: newOrderId }))

    if (id) {
      // Properly handle async operation
      fetchIncomingOrderDetails().then((data) => {
        console.log('Fetched Order Data:', data)

        if (data?.orders?.orderItems && Array.isArray(data.orders.orderItems)) {
          const mappedItems = data.orders.orderItems.map((item) => ({
            ...item,
            code: item?.productCode || item?.ProductCode || '-',
            name: item?.name || '-',
            company: item?.company || '-',
            MRP: parseFloat(item?.price || item?.MRP) || 0,
            Rate: parseFloat(item?.price || item?.Rate) || 0,
            Quantity: parseInt(item?.Quantity) || 1,
            Deal: parseInt(item?.Deal) || 0,
            Free: parseInt(item?.Free) || 0,
            DiscAmt: parseFloat(item?.DiscAmt) || 0,
            Disc: parseFloat(item?.Disc) || 0,
            Subtotal: parseFloat(item?.Subtotal) || 0,
            FreeQuantity: parseInt(item?.FreeQuantity) || 0,
            hsn: item?.hsn || ''
          }))

          console.log('Mapped Bill Items:', mappedItems)
          setBillItems(mappedItems)
          toast.success('Order loaded successfully')
        } else {
          console.warn('No order items found in response')
          toast.error('No items found in this order')
        }
      })
    } else {
      setBillItems([])
    }
  }, [id])

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
        CustomerID: String(customer.rid || ''),
        CustMobile: customer.phone1 || '',
        CustomerGST: customer.GSTIN || '',
        Address: customer.address || '',
        ShipName: customer.name || '',
        ShipAdd1: customer.address || '',
        ShipAdd2: customer.area || '',
        ShipAdd3: customer.city || ''
      }))
      // Auto-detect GST type from GSTIN: if GSTIN present default to IGST (inter-state)
      // User can override manually; if no GSTIN, default CGST+SGST
      setGstType(customer.GSTIN ? 'igst' : 'cgst_sgst')
    } else {
      setOrderData((prev) => ({
        ...prev,
        CustomerID: '',
        CustMobile: '',
        Address: '',
        ShipName: '',
        ShipAdd1: '',
        ShipAdd2: '',
        ShipAdd3: '',
        CustomerGST: ''
      }))
      setGstType('igst')
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
    console.log('Adding product to bill:', product)
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
      const rate = parseFloat(product.Rate) || parseFloat(product.hsnDetails?.taxRate) || 0
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
          hsn: product.hsnDetails?.hsnCode || '',
          taxRate: product.hsnDetails?.taxRate || 0,
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

  const handleHsnChange = async (code, newValue) => {
    console.log('new value :: ', newValue)

    const hsnValue = newValue ? newValue.value.split(' ')[0] : ''
    const taxRate = newValue ? newValue.taxRate || 0 : 0
    setBillItems(
      billItems.map((item) =>
        item.code === code ? { ...item, hsn: hsnValue, taxRate: taxRate } : item
      )
    )

    try {
      const item = billItems.find((i) => i.code === code)
      if (item && item._id) {
        const updateData = {
          hsnCode: hsnCodes.find((h) => h.hsnCode === hsnValue)?._id,
          taxRate: taxRate
        }
        await productApi.updateProduct(item.rid, updateData)
        toast.success(`Product HSN updated (GST: ${taxRate}%)`)
      }
    } catch (err) {
      console.error('Failed to update product HSN', err)
      toast.error('Failed to update product HSN')
    }
  }

  const handleCreateHsn = async (inputValue) => {
    const newOption = { label: inputValue, value: inputValue }
    // optimistic add
    setHsnOptions((prev) => [...prev, newOption])
    try {
      const resp = await createHsnCode.postHsnCode({ hsnCode: inputValue })
      const saved = resp?.data || resp
      const savedValue = saved?.code || saved?.value || inputValue
      const savedOption = { label: savedValue, value: savedValue }

      setHsnOptions((prev) => {
        const filtered = prev.filter((o) => o.value !== inputValue)
        return [...filtered, savedOption]
      })
      toast.success('HSN saved')
    } catch (err) {
      console.error('Failed to save HSN', err)
      toast.error('Failed to save HSN')
    }
  }

  const calculateSubtotal = () => {
    return billItems ? billItems.reduce((sum, item) => sum + item.MRP * item.Quantity, 0) : 0
  }

  const calculateTotalDiscount = () => {
    return billItems ? billItems.reduce((sum, item) => sum + (item.DiscAmt || 0), 0) : 0
  }

  const calculateGST = (item) => {
    const taxableAmount = (item?.Rate || 0) * item?.Quantity
    const gstAmount = (taxableAmount * (item?.taxRate || 0)) / 100
    return gstAmount
  }

  // IGST = full GST; CGST = SGST = half each
  const calculateIGST = (item) => calculateGST(item)
  const calculateCGST = (item) => calculateGST(item) / 2
  const calculateSGST = (item) => calculateGST(item) / 2

  const calculateTotalGST = () => {
    return billItems ? billItems.reduce((sum, item) => sum + calculateGST(item), 0) : 0
  }
  const calculateTotalIGST = () => calculateTotalGST()
  const calculateTotalCGST = () => calculateTotalGST() / 2
  const calculateTotalSGST = () => calculateTotalGST() / 2

  const calculateTotal = () => {
    return (
      calculateSubtotal() -
      calculateTotalDiscount() -
      orderData.Discounts +
      calculateTotalGST() +
      parseFloat(orderData.Transport || 0) +
      parseFloat(orderData.Delivery || 0)
    )
  }

  const totalAmount = parseFloat(
    billItems.reduce((sum, item) => sum + (item.MRP || 0) * (item.Quantity || 0), 0).toFixed(2)
  )
  const totalTaxAmount = parseFloat(
    billItems
      .reduce((sum, item) => {
        const taxable = (item.Rate || 0) * (item.Quantity || 0)
        return sum + (taxable * (item.taxRate || 0)) / 100
      }, 0)
      .toFixed(2)
  )
  const totalDiscountAmount = parseFloat(
    billItems.reduce((sum, item) => sum + (item.DiscAmt || 0), 0).toFixed(2)
  )
  const totalInvoiceValue = parseFloat(
    (totalAmount + totalTaxAmount - totalDiscountAmount).toFixed(2)
  )

  const handleSubmitBill = async (e) => {
    e.preventDefault()

    if (!orderData.CustomerID) {
      toast.error('Please select a customer')
      return
    }

    if (billItems?.length === 0) {
      toast.error('Please add items to the bill')
      return
    }

    if (!orderData.PaymentMode) {
      toast.error('Please select a payment mode')
      return
    }

    console.log({
      orderData,
      billItems
    })

    // Prepare data in Marg API format matching the documentation
    const payload = {
      OrderID: orderData.OrderID,
      OrderNo: generateOrderId(),
      CustomerDetails: {
        CustomerID: String(orderData.CustomerID),
        Lat: '',
        Lng: '',
        Address: orderData.Address || '',
        GpsID: '0',
        UserType: '1',
        Points: parseFloat(orderData.Points || 0).toFixed(2),
        Discounts: orderData.Discounts || '0',
        Transport: orderData.Transport || '',
        Delivery: orderData.Delivery || '',
        Bankname: orderData.BankName || '',
        BankAdd1: orderData.BankAdd1 || '',
        BankAdd2: orderData.BankAdd2 || '',
        shipname: orderData.ShipName || '',
        shipAdd1: orderData.ShipAdd1 || '',
        shipAdd2: orderData.ShipAdd2 || '',
        shipAdd3: orderData.ShipAdd3 || '',
        order_remarks: orderData.OrderRemarks || '',
        CustName: orderData.ShipName || '',
        CustMobile: orderData.CustMobile || ''
      },
      PaymentDetails: {
        paymentmode: orderData.PaymentMode,
        paymentmodeAmount: orderData.PaymentModeAmount || '0',
        payment_remarks: orderData.PaymentRemarks,
        gstType: gstType,
        totalAmount: totalAmount,
        totalTaxAmount: totalTaxAmount,
        totalDiscountAmount: totalDiscountAmount,
        totalInvoiceValue: totalInvoiceValue
      },
      ProductDetails: billItems.map((item) => {
        const taxable = (item.Rate || 0) * (item.Quantity || 0)
        const taxAmount = parseFloat(((taxable * (item.taxRate || 0)) / 100).toFixed(2))
        return { ...item, taxAmount }
      })
    }

    console.log('payload :: ', payload)

    // return

    const response = await outgoingOrderApi.createOutgoingOrder(payload, salesId)
    console.log('Marg Order Response:', response)

    if (response.success) {
      toast.success('Bill created successfully!')
      setOrderData({
        OrderID: generateOrderId(),
        OrderNo: generateOrderId(),
        CustomerID: '',
        ProductCode: '',
        Quantity: '',
        Free: '',
        Lat: '',
        Lng: '',
        Address: '',
        GpsID: '0',
        UserType: '1',
        Points: '0',
        Discounts: '0',
        Transport: '',
        Delivery: '',
        BankName: '',
        BankAdd1: '',
        BankAdd2: '',
        shipname: '',
        shipAdd1: '',
        shipAdd2: '',
        shipAdd3: '',
        paymentmode: '',
        paymentmodeAmount: '0',
        payment_remarks: '',
        order_remarks: '',
        CustName: '',
        CustMobile: ''
      })

      setBillItems([])
      setSelectedCustomer(null)
      setSelectedProduct(null)
    } else {
      toast.error('Failed to create bill')
    }
  }

  const handleRefresh = () => {
    const newOrderId = generateOrderId()
    setOrderData((prev) => ({ ...prev, OrderID: newOrderId }))
  }

  const handleReset = () => {
    setOrderData({
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
      GpsID: '0',
      UserType: 1,
      Points: '0.00',
      Discounts: '0',
      Transport: '',
      Delivery: '',
      BankName: '',
      BankAdd1: '',
      BankAdd2: '',
      ShipName: '',
      ShipAdd1: '',
      ShipAdd2: '',
      ShipAdd3: '',
      PaymentMode: '1',
      PaymentModeAmount: '0',
      PaymentRemarks: '',
      OrderRemarks: '',
      CustMobile: '',
      CompanyCode: 'MARGLIVE',
      OrderFrom: 'MARGLIVE'
    })

    setBillItems([])
    setSelectedCustomer(null)
    setSelectedProduct(null)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Bill - ORD-{orderData.OrderID}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <IoIosRefresh className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RxReset className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSubmitBill} disabled={Number(totalInvoiceValue) < 1000}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">GST Tax Type</label>
                <Select value={gstType} onValueChange={setGstType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select GST type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="igst">IGST (Inter-state / Central)</SelectItem>
                    <SelectItem value="cgst_sgst">CGST + SGST (Intra-state / State)</SelectItem>
                  </SelectContent>
                </Select>
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
              {billItems && billItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added to bill yet. Search and add products above.
                </div>
              ) : (
                <div className="border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Code</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead className="w-[180px]">HSN</TableHead>
                        <TableHead>MRP</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Deal</TableHead>
                        <TableHead>Free</TableHead>
                        {gstType === 'igst' ? (
                          <TableHead>IGST</TableHead>
                        ) : (
                          <>
                            <TableHead>CGST</TableHead>
                            <TableHead>SGST</TableHead>
                          </>
                        )}
                        <TableHead>Disc Amt</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItems &&
                        billItems.map((item) => (
                          <TableRow key={item?.code}>
                            <TableCell className="font-medium">{item?.code}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{item?.name}</span>
                                {item?.company && (
                                  <span className="text-xs text-muted-foreground">
                                    {item?.company}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="w-[180px]">
                              <CreatableSelect
                                isClearable
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                onChange={(newValue) => handleHsnChange(item.code, newValue)}
                                onCreateOption={(inputValue) => {
                                  handleCreateHsn(inputValue)
                                  handleHsnChange(item.code, { value: inputValue })
                                }}
                                options={hsnOptions}
                                value={item.hsn ? { label: item.hsn, value: item.hsn } : null}
                                placeholder="Enter HSN code + gst%"
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={{
                                  control: (base) => ({ ...base, minWidth: 160, width: 160 }),
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {(item?.MRP || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item?.Rate}
                                onChange={(e) => {
                                  const newRate = parseFloat(e.target.value) || 0
                                  const discount = calculateDiscount(
                                    item?.MRP,
                                    newRate,
                                    item?.Quantity
                                  )
                                  setBillItems(
                                    billItems.map((i) =>
                                      i?.code === item?.code
                                        ? { ...i, Rate: newRate, ...discount }
                                        : i
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
                                value={item?.Quantity}
                                onChange={(e) => updateQuantity(item?.code, e.target.value)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {item?.Deal > 0 ? (
                                <span className="text-sm font-medium text-blue-600">
                                  {item?.Deal}+{item?.Free}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {item?.FreeQuantity > 0 ? (
                                <span className="text-sm font-semibold text-green-600">
                                  {item?.FreeQuantity}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </TableCell>
                            {gstType === 'igst' ? (
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {calculateIGST(item).toFixed(2)}
                                  </span>
                                  {item?.taxRate > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      ({item?.taxRate}%)
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            ) : (
                              <>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {calculateCGST(item).toFixed(2)}
                                    </span>
                                    {item?.taxRate > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        ({(item?.taxRate / 2).toFixed(1)}%)
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {calculateSGST(item).toFixed(2)}
                                    </span>
                                    {item?.taxRate > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        ({(item?.taxRate / 2).toFixed(1)}%)
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                              </>
                            )}
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-red-600 font-medium">
                                  {(item?.DiscAmt || 0).toFixed(2)}
                                </span>
                                {item?.Disc > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    ({item?.Disc.toFixed(2)}%)
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {((item?.Rate || 0) * item?.Quantity - (item?.DiscAmt || 0)).toFixed(
                                2
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item?.code)}
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
                    name="ShipAdd1"
                    value={orderData.ShipAdd1}
                    onChange={handleOrderChange}
                    placeholder="Address line 1"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="ShipAdd2"
                    value={orderData.ShipAdd2}
                    onChange={handleOrderChange}
                    placeholder="Address line 2"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="ShipAdd3"
                    value={orderData.ShipAdd3}
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
                    name="BankAdd1"
                    value={orderData.BankAdd1}
                    onChange={handleOrderChange}
                    placeholder="Bank address line 1"
                  />
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="BankAdd2"
                    value={orderData.BankAdd2}
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
                    <option value="1">Cash</option>
                    <option value="2">Card</option>
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
                    name="PaymentRemarks"
                    value={orderData.PaymentRemarks}
                    onChange={handleOrderChange}
                    placeholder="Payment remarks"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Remarks</label>
                  <Textarea
                    name="OrderRemarks"
                    value={orderData.OrderRemarks}
                    onChange={handleOrderChange}
                    placeholder="Order remarks"
                    rows={2}
                  />
                </div>

                <h4 className="font-medium text-sm border-b pb-2 pt-2">Bill Summary</h4>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Item Discounts:</span>
                    <span className="font-medium text-red-600">
                      -{calculateTotalDiscount().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Discount:</span>
                    <span className="font-medium text-red-600">
                      -{parseFloat(orderData.Discounts || 0).toFixed(2)}
                    </span>
                  </div>
                  {gstType === 'igst' ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">IGST:</span>
                      <span className="font-medium text-blue-600">
                        +{calculateTotalIGST().toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CGST:</span>
                        <span className="font-medium text-blue-600">
                          +{calculateTotalCGST().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">SGST:</span>
                        <span className="font-medium text-blue-600">
                          +{calculateTotalSGST().toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transport:</span>
                    <span className="font-medium">
                      {parseFloat(orderData.Transport || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery:</span>
                    <span className="font-medium">
                      {parseFloat(orderData.Delivery || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">{calculateTotal().toFixed(2)}</span>
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
