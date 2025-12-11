import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/productService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

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
    status: 'active',
    image: null
  });

  useEffect(() => {
    if (isEditMode) {
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
            status: product.status || 'active',
            image: null 
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
      
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
      <Button variant="ghost" className="pl-0 text-gray-500 hover:text-gray-900" onClick={() => navigate('/admin/products')} style={{ paddingBottom: '20px' }}>  
         <ArrowLeft className="mr-2 h-4 w-4" />
         <span style={{ marginTop: '4px' }}>Back to Products</span>
      </Button>

      <div className="flex justify-between items-center" style={{ marginTop: '10px' }}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: '15px' }}>
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader style={{ paddingBottom: '15px' }}>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>Enter the basic information for the product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2" style={{ marginBottom: '30px' }}>
                             <Label htmlFor="name">Product Name</Label>
                             <Input 
                                id="name"
                                name="name"
                                required
                                placeholder="e.g. Paracetamol 500mg"
                                value={formData.name}
                                onChange={handleChange}
                                style={{ padding: '20px 10px' }}
                             />
                        </div>
                        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '30px' }}>
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input 
                                    id="sku"
                                    name="sku"
                                    required
                                    className="font-mono"
                                    placeholder="e.g. MED-001"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    style={{ padding: '20px 10px' }}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <select 
                                    id="category"
                                    name="category"
                                    required
                                    className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ padding: '12px 5px' }}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Medicine">Medicine</option>
                                    <option value="Skincare">Skincare</option>
                                    <option value="Wellness">Wellness</option>
                                    <option value="Devices">Devices</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-2" style={{ marginBottom: '30px' }}>
                            <Label htmlFor="status">Status</Label>
                            <select 
                                id="status"
                                name="status"
                                required
                                className="flex h-auto w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
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
            <div className="space-y-6">
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
                                style={{ padding: '20px 10px' }}
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
                                style={{ padding: '20px 10px' }}
                             />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group" style={{ padding: '20px 10px' }}>
                             <div className="w-full mx-auto flex items-center justify-center">
                              <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-white transition-colors">
                                <Upload className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                             </div>
                             </div>
                             <div className="text-sm font-medium text-gray-900">Click to upload</div>
                             <div className="text-xs text-gray-500 mt-1">SVG, PNG, JPG (max. 2MB)</div>
                             <input type="file" className="hidden" />
                        </div>
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
    </div>
  );
};

export default ProductForm;
