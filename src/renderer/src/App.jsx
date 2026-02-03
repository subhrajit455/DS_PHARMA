import { Link, Outlet } from 'react-router'
import { Button } from '@/components/ui/button'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setCategories, setError, setLoading } from './store/features/categorySlice'
import { useEffect } from 'react'
import axios from 'axios'
import { categoryUrl, customerUrl } from './config'
import {
  setCustomers,
  setError as setCustomerError,
  setLoading as setCustomerLoading
} from './store/features/customerSlice'

function App() {
  const dispatch = useDispatch()

  const fetchCategories = async () => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const res = await axios.get(categoryUrl.getPaginatedCategories)
      dispatch(setCategories(res.data.data || []))
      console.log('Fetched categories:', res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load categories')
      dispatch(setError(err.message))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const fetchCustomers = async () => {
    dispatch(setCustomerLoading(true))
    dispatch(setCustomerError(null))
    try {
      const res = await axios.get(customerUrl.getAllCustomers)
      dispatch(setCustomers(res.data.data || []))
      console.log('Fetched customers:', res.data.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load customers')
      dispatch(setCustomerError(err.message))
    } finally {
      dispatch(setCustomerLoading(false))
    }
  }

  useEffect(() => {
    fetchCategories()
    // fetchCustomers()
  }, [])

  return (
    <div className="flex flex-col w-full">
      <main className="flex flex-col w-full">
        <Outlet />
        <Link to="/admin/dashboard">
          <Button>Admin</Button>
        </Link>
        <Link to="/staff/dashboard">
          <Button>Staff</Button>
        </Link>
      </main>
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  )
}

export default App
