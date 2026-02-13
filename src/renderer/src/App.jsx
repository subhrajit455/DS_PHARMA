import { categoryApi, dashboardApi, productApi } from '@/api'
import { Button } from '@/components/ui/button'
import { setCategories, setError, setLoading } from '@/store/features/categorySlice'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, Outlet } from 'react-router'
import { setExpiredProducts, setLowStockProducts } from './store/features/dashboardSlice'

function App() {
  const dispatch = useDispatch()

  const fetchCategories = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const res = await categoryApi.getAllCategories({
        query: '',
        all: true
      })

      dispatch(setCategories(res.data || []))
    } catch (err) {
      console.error(err)
      toast.error('Failed to load categories')
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchLowStockProducts = async () => {
    try {
      const response = await productApi.getLowStockProducts()

      console.log('low stock :: ', response)

      dispatch(setLowStockProducts(response.data.products))
    } catch (error) {
      console.error('Error fetching low stock products:', error)
    }
  }

  const fetchExpiredProducts = async () => {
    try {
      const response = await dashboardApi.getExpiredProducts()
      dispatch(setExpiredProducts(response.data))
    } catch (error) {
      console.error('Error fetching expired products:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchLowStockProducts()
    // fetchExpiredProducts()
  }, [])

  return (
    <div className="flex flex-col w-full">
      <main className="flex flex-col w-full">
        <Outlet />
        {/* <Link to="/admin/dashboard">
          <Button>Admin</Button>
        </Link>
        <Link to="/staff/dashboard">
          <Button>Staff</Button>
        </Link> */}
      </main>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            padding: '10px',
            color: '#27272a',
            borderRadius: '0px'
          }
        }}
      />
    </div>
  )
}

export default App
