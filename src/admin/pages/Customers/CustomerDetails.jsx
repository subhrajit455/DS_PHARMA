import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminCard from '../../components/ui/AdminCard';
import AdminTable from '../../components/ui/AdminTable';
import { customerService } from '../../api/customerService';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomer(id);
        setCustomer(data);
      } catch (error) {
        console.error(error);
        toast.error('Customer not found');
        navigate('/admin/customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  if (!customer) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate('/admin/customers')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Customers</span>
      </button>

      {/* Header Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold uppercase">
           {customer.name.substring(0, 2)}
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
           <h1 className="text-2xl font-bold text-slate-800">{customer.name}</h1>
           <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Mail size={16} /> {customer.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={16} /> {customer.phone}</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined {customer.joined}</span>
           </div>
           <div className="pt-2">
             <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
             }`}>
                {customer.status}
             </span>
           </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 md:border-l border-slate-100 md:pl-6">
           <div className="text-center">
              <p className="text-sm text-slate-500 mb-1">Total Orders</p>
              <p className="text-xl font-bold text-slate-800">{customer.orders}</p>
           </div>
           <div className="text-center">
              <p className="text-sm text-slate-500 mb-1">Total Spent</p>
              <p className="text-xl font-bold text-emerald-600">₹{customer.totalSpent}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Orders */}
        <div className="lg:col-span-2">
           <AdminCard title="Order History">
              <AdminTable headers={['Order ID', 'Date', 'Total', 'Status', 'Action']}>
                 {customer.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                       <td className="px-6 py-4 font-medium text-slate-800">{order.id}</td>
                       <td className="px-6 py-4 text-slate-600">{order.date}</td>
                       <td className="px-6 py-4 font-bold text-slate-800">₹{order.total}</td>
                       <td className="px-6 py-4">
                           <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                             {order.status}
                           </span>
                       </td>
                       <td className="px-6 py-4">
                          <button 
                             onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                             className="text-blue-600 hover:underline text-sm font-medium"
                          >
                             View
                          </button>
                       </td>
                    </tr>
                 ))}
                 {customer.recentOrders.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>
                 )}
              </AdminTable>
           </AdminCard>
        </div>

        {/* Right Column: Address & Notes */}
        <div className="space-y-6">
           <AdminCard title="Default Address">
              <div className="flex items-start gap-4">
                 <div className="mt-1 text-slate-400"><MapPin size={20} /></div>
                 <p className="text-sm text-slate-600 leading-relaxed">{customer.address}</p>
              </div>
           </AdminCard>
           
           <AdminCard title="Payment Methods">
              <div className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg">
                 <div className="p-2 bg-slate-50 rounded"><CreditCard size={20} className="text-slate-600" /></div>
                 <div>
                    <p className="text-sm font-medium text-slate-800">Visa ending in 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/25</p>
                 </div>
              </div>
           </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
