import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminTable from '../../components/ui/AdminTable';
import { productService } from '../../api/productService';

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getProducts({ query: searchQuery });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Active': 'bg-emerald-100 text-emerald-700',
      'Low Stock': 'bg-yellow-100 text-yellow-700',
      'Out of Stock': 'bg-red-100 text-red-700',
    };
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your pharmacy inventory</p>
        </div>
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading products...</div>
        ) : (
          <AdminTable headers={['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                  <td className="px-6 py-4 font-medium text-slate-800">{product.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-4 text-slate-600">{product.category}</td>
                  <td className="px-6 py-4 font-medium">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock < 10 ? 'text-red-600 font-medium' : 'text-slate-600'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </AdminTable>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
