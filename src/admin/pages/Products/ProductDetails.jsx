import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowLeft, Package, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productService } from '../../api/productService';
import AdminCard from '../../components/ui/AdminCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
        toast.error('Product not found');
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Product deleted successfully');
        navigate('/admin/products');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
  if (!product) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
       <button 
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => navigate(`/admin/products/${id}/edit`)}
             className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
           >
             <Edit size={18} />
             <span>Edit</span>
           </button>
           <button 
             onClick={handleDelete}
             className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-slate-200 rounded-lg hover:bg-red-50 transition-colors"
           >
             <Trash2 size={18} />
             <span>Delete</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
           <AdminCard title="Product Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                 <div>
                    <label className="text-sm font-medium text-slate-500">SKU</label>
                    <p className="text-slate-800 font-mono mt-1">{product.sku}</p>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-slate-500">Category</label>
                    <p className="text-slate-800 mt-1">{product.category}</p>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-slate-500">Price</label>
                    <p className="text-slate-800 font-bold text-lg mt-1">₹{product.price}</p>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-slate-500">Stock Status</label>
                    <div className="mt-1">
                       <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold 
                          ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {product.status}
                       </span>
                       <span className="ml-2 text-slate-600 text-sm">({product.stock} units)</span>
                    </div>
                 </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                  <label className="text-sm font-medium text-slate-500">Description</label>
                  <p className="text-slate-600 mt-2 leading-relaxed">
                     {product.description || 'No description available for this product.'}
                  </p>
              </div>
           </AdminCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
              <div className="w-32 h-32 bg-slate-100 rounded-lg mx-auto flex items-center justify-center text-slate-400 mb-4">
                  <Package size={40} />
              </div>
              <p className="text-sm text-slate-500">Product Image Preview</p>
           </div>

           <AdminCard title="Metadata">
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Created At</span>
                    <span className="text-slate-800 font-medium">Dec 12, 2023</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Last Updated</span>
                    <span className="text-slate-800 font-medium">2 hours ago</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Created By</span>
                    <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                       <User size={14} /> Admin User
                    </span>
                 </div>
              </div>
           </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
