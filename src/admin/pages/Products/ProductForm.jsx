import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/productService';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null
  });

  useEffect(() => {
    if (isEditMode) {
      // Fetch product data
      const fetchProduct = async () => {
        try {
          const product = await productService.getProduct(id);
          setFormData({
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            image: null // Handle image logic properly in real app
          });
        } catch (error) {
          console.error(error);
          toast.error('Failed to fetch product details');
          navigate('/admin/products');
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditMode) {
        await productService.updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      }
      
      // Invalidate products query to force refresh
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8" style={{ padding: '1rem' }}>
      <button 
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Products</span>
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. Paracetamol 500mg"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input 
              type="text" 
              name="sku"
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              placeholder="e.g. MED-001"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select 
              name="category"
              required
              className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Medicine">Medicine</option>
              <option value="Skincare">Skincare</option>
              <option value="Wellness">Wellness</option>
              <option value="Devices">Devices</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
             <input 
               type="number" 
               name="price"
               required
               min="0"
               step="0.01"
               className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
               value={formData.price}
               onChange={handleChange}
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
             <input 
               type="number" 
               name="stock"
               required
               min="0"
               className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
               value={formData.stock}
               onChange={handleChange}
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            name="description"
            rows="4"
            className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Product detailed description..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Image Upload Placeholder */}
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-sm text-slate-600 font-medium">Click to upload product image</p>
            <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
           <button 
             type="submit"
             disabled={isLoading}
             className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
           >
             <Save size={20} />
             <span>{isLoading ? 'Saving...' : 'Save Product'}</span>
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
