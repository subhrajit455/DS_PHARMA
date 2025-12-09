import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminTable from '../../components/ui/AdminTable';
import { customerService } from '../../api/customerService';

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomers({ search: searchQuery });
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your customer base</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
           <div className="p-12 text-center text-slate-500">Loading customers...</div>
        ) : (
           <AdminTable headers={['Customer', 'Contact', 'Joined', 'Orders', 'Total Spent', 'Status', 'Actions']}>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                    <td className="px-6 py-4">
                       <div className="font-medium text-slate-800">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                             <Mail size={12} /> {customer.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                             <Phone size={12} /> {customer.phone}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{customer.joined}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{customer.orders}</td>
                    <td className="px-6 py-4 text-slate-800 font-bold">₹{customer.totalSpent}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                       }`}>
                          {customer.status}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <button 
                         onClick={() => navigate(`/admin/customers/${customer.id}`)}
                         className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                       >
                          Details <ArrowRight size={14} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                     No customers found.
                   </td>
                </tr>
              )}
           </AdminTable>
        )}
      </div>
    </div>
  );
};

export default CustomersList;
