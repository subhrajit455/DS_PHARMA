import { categoryApi, createHsnCode, productApi } from '@/api'
import { setCategories, setError, setLoading } from '@/store/features/categorySlice'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router'
import {
  setLowStockError,
  setLowStockLoading,
  setLowStockProducts
} from './store/features/dashboardSlice'
import { setHsnCodes } from './store/features/hsnSlice'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

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
    dispatch(setLowStockLoading(true))
    dispatch(setLowStockError(null))
    try {
      const response = await productApi.getLowStockProducts({
        limit: 5
      })

      console.log('low stock :: ', response)

      dispatch(
        setLowStockProducts({
          products: response.data.lowStockProducts,
          totalCount: response.data.totalProducts
        })
      )
    } catch (error) {
      console.error('Error fetching low stock products:', error)
      dispatch(setLowStockError(error.message))
    } finally {
      dispatch(setLowStockLoading(false))
    }
  }

  const fetchHsnCode = async () => {
    try {
      const response = await createHsnCode.getHsnCode()
      dispatch(setHsnCodes(response?.data.hsn))
    } catch (error) {
      console.error('Error fetching HSN codes:', error)
    }
  }

  useEffect(() => {
    if (!user) return // don't fetch when unauthenticated
    fetchCategories()
    fetchLowStockProducts()
    fetchHsnCode()
  }, [user])

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
