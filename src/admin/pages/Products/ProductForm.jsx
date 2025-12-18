import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Package, Tag, DollarSign, Box, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/productService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ImageUpload from '../../../components/common/ImageUpload';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    status: 'active',
    isVisible: true,
    images: [] 
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await productService.getCategories();
            // Handle both simple string array or object array structure
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };
    fetchCategories();
  }, []);

  // Fetch Product Details
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const product = await productService.getProduct(id);
          setFormData({
            name: product.name,
            sku: product.sku || '',
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description || '',
            status: product.status || 'active',
            isVisible: product.isVisible !== undefined ? product.isVisible : true,
            // Ensure backward compatibility: use images array or fallback to single image wrapped in array
            images: product.images && product.images.length > 0 
                ? product.images 
                : (product.image ? [product.image] : [])
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

  const handleImageChange = (newImages) => {
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    // Prepare payload
    const payload = {
        ...formData,
        // Ensure the primary 'image' field is set for legacy compatibility (using first image)
        image: formData.images.length > 0 ? formData.images[0] : null,
        // Ensure numeric values
        price: Number(formData.price),
        stock: Number(formData.stock),
    };

    try {
      if (isEditMode) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created successfully');
      }
      
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 min-h-screen" style={{ padding: '5px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900 text-[8px] sm:text-sm" onClick={() => navigate('/admin/products')} style={{ paddingBottom: '15px sm:20px' }}>  
         <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
         <span style={{ marginTop: '4px' }}>Back to Products</span>
      </Button>

      <div className="flex justify-between items-center" style={{ marginTop: '8px' }}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
                <Card>
                    <CardHeader className="pb-2 sm:pb-3 md:pb-4" style={{ paddingBottom: '15px' }}>
                        <CardTitle className="text-base sm:text-lg md:text-xl">Product Details</CardTitle>
                        <CardDescription className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm">Enter the basic information for the product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4">
                        <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                             <Label htmlFor="name" className="text-[8px] sm:text-sm">Product Name</Label>
                             <Input 
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. Paracetamol 500mg"
                                className="text-[12px] h-10 sm:h-auto"
                                value={formData.name}
                                onChange={handleChange}
                                icon={Package}
                                style={{ padding: '10px 35px' }}
                             />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" style={{ marginBottom: '20px' }}>
                            <div className="grid gap-2">
                                <Label htmlFor="sku" className="text-[8px] sm:text-sm">SKU</Label>
                                <Input 
                                    id="sku"
                                    name="sku"
                                    className="font-mono text-[12px] h-10 sm:h-auto"
                                    placeholder="e.g. MED-001"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    icon={Tag}
                                    style={{ padding: '10px 35px' }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category" className="text-[8px] sm:text-sm">Category</Label>
                                <select 
                                    id="category"
                                    name="category"
                                    required
                                    className="flex h-10 sm:h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[8px] sm:text-[12px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ padding: '10px 5px' }}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat.name || cat}>{cat.name || cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Status and Visibility Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center" style={{ marginBottom: '20px' }}>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status"
                                    name="status"
                                    required
                                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.status}
                                    onChange={handleChange}
                                    style={{ padding: '10px 5px' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>
                            
                            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <Label className="text-gray-600 font-medium text-xs">Website Visibility</Label>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                        {formData.isVisible ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-gray-400" />}
                                        {formData.isVisible ? 'Visible to Customers' : 'Hidden from Website'}
                                    </span>
                                    <Switch 
                                        checked={formData.isVisible}
                                        onCheckedChange={(checked) => setFormData(prev => ({...prev, isVisible: checked}))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2" style={{ marginBottom: '20px' }}>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[12px] shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                placeholder="Product detailed description..."
                                value={formData.description}
                                onChange={handleChange}
                                style={{ padding: '20px 10px' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Side Info */}
            <div className="space-y-4 sm:space-y-6">
                <Card style={{ marginBottom: '10px', padding: '10px' }}>
                    <CardHeader>
                        <CardTitle>Pricing & Inventory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2" style={{ marginBottom: '10px' }}>
                             <Label htmlFor="price">Price (₹)</Label>
                             <Input 
                                id="price"
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                icon={DollarSign}
                                style={{ padding: '20px 30px' }}
                             />
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="stock">Stock</Label>
                             <Input 
                                id="stock"
                                type="number"
                                name="stock"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                icon={Box}
                                style={{ padding: '20px 35px' }}
                             />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload one or more images.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ImageUpload 
                            images={formData.images}
                            onChange={handleImageChange}
                            maxFiles={5}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>

        <div className="flex justify-end pt-6" style={{ marginTop: '10px' }}>
           <Button type="submit" disabled={isLoading} size="md" style={{ padding: '5px 10px' }}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? <span style={{ marginTop: '4px', paddingLeft: '5px' }}>Saving...</span> : <span style={{ marginTop: '4px', paddingLeft: '5px' }}>Save Product</span>}
           </Button>
        </div>
      </form>
      
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Product" : "Create Product"}
        message={isEditMode ? "Are you sure you want to update this product details?" : "Are you sure you want to create this new product?"}
        confirmText={isEditMode ? "Update" : "Create"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductForm;
