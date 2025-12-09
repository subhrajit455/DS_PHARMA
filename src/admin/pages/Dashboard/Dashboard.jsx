import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminCard from '../../components/ui/AdminCard';
import AdminTable from '../../components/ui/AdminTable';
import { productService } from '../../api/productService';
import { orderService } from '../../api/orderService';
import { customerService } from '../../api/customerService';

const StatCard = ({ title, value, icon, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
        <span>{trend}</span>
        <span>vs last month</span>
      </div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    customers: 0,
    products: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsData, ordersData, customersData] = await Promise.all([
          productService.getProducts({ limit: 100 }), // Get all or sufficient amount to count
          orderService.getOrders(),
          customerService.getCustomers()
        ]);

        // Calculate Stats
        const totalSales = ordersData.reduce((sum, order) => sum + (order.paymentBreakdown?.total || order.price || 0), 0);
        
        setStats({
          sales: totalSales.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }),
          orders: ordersData.length,
          customers: customersData.length,
          products: productsData.total || productsData.data.length
        });

        // Recent Orders
        const sortedOrders = [...ordersData].reverse().slice(0, 5);
        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-orange-100 text-orange-700';
      case 'On the Way': return 'bg-orange-100 text-orange-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Out For Delivery': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Sales', value: stats.sales, icon: <DollarSign size={24} />, trend: '+12.5%', trendUp: true },
    { title: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={24} />, trend: '+8.2%', trendUp: true },
    { title: 'Total Customers', value: stats.customers, icon: <Users size={24} />, trend: '+2.1%', trendUp: true },
    { title: 'Total Products', value: stats.products, icon: <Package size={24} />, trend: '+4.5%', trendUp: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <AdminCard title="Recent Orders" actions={<button onClick={() => navigate('/admin/orders')} className="text-sm text-blue-600 font-medium hover:underline">View All</button>}>
                <AdminTable headers={['Order ID', 'Customer', 'Product', 'Amount', 'Status']}>
                    {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-700 cursor-pointer hover:text-blue-600" onClick={() => navigate(`/admin/orders/${order.id}`)}>#{order.id}</td>
                            <td className="px-6 py-4 text-slate-600">{order.customerName}</td>
                            <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={order.productName}>{order.productName}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">₹{order.paymentBreakdown?.total || order.price}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr><td colSpan="5" className="p-4 text-center text-slate-500">No active orders</td></tr>
                    )}
                </AdminTable>
            </AdminCard>
        </div>
        
        {/* Quick Actions / Mini Widget */}
        <div className="space-y-6">
             <AdminCard title="Quick Actions">
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('/admin/products/new')} className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center">
                        Add Product
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center">
                         View Orders
                    </button>
                    <button onClick={() => navigate('/admin/customers')} className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center">
                         View Customers
                    </button>
                    <button className="p-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-center opacity-50 cursor-not-allowed">
                         View Reports
                    </button>
                </div>
             </AdminCard>
             
             <AdminCard title="Platform Traffic">
                <div className="h-48 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                    <span className="text-slate-400 text-sm">Chart Placeholder</span>
                </div>
             </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
