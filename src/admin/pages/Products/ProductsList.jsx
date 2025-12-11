import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Filter, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
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

  const getStatusVariant = (status) => {
      const s = status?.toLowerCase() || '';
      if (s === 'active') return 'success';
      if (s === 'low stock') return 'warning';
      if (s === 'out of stock') return 'destructive';
      return 'secondary';
  };

  return (
        <div className="space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ paddingBottom: '20px' }}>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage your pharmacy inventory</p>
                </div>
                <Button onClick={() => navigate('/admin/products/new')} style={{ padding: '0px 5px' }}>
                    <Plus className="mr-2 h-4 w-4"  /> <span style={{ marginTop: '3px' }}>Add Product</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-4 sm:p-6 space-y-4" style={{ padding: '10px' }}>
                    {/* Filters & Search */}
                    <div className="flex flex-col sm:flex-row gap-4" style={{ paddingBottom: '10px' }}>
                        <div className="relative flex-1">
                            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: '19px' }}
                            />
                        </div>
                        <Button variant="outline" className="shrink-0" style={{ padding: '0px 5px' }}>
                            <Filter className="mr-2 h-4 w-4" />
                            <span style={{ marginTop: '3px' }}>Filter</span>
                        </Button>
                    </div>

                    {/* Products Table */}
                    <div className="rounded-md border border-gray-200" style={{ padding: '10px' }}>
                        <Table>
                            <TableHeader>
                                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>SKU</TableHead>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Category</TableHead>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Price</TableHead>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Stock</TableHead>
                                    <TableHead className="font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700" style={{ padding: '6px 8px' }}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            Loading products...
                                        </TableCell>
                                    </TableRow>
                                ) : products.length > 0 ? (
                                    products.map((product, index) => (
                                        <TableRow 
                                            key={product.id}
                                            className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100"
                                            style={{ 
                                                marginBottom: index !== products.length - 1 ? '10px' : '0',
                                            }}
                                        >
                                            <TableCell className="font-medium text-gray-900" style={{ padding: '10px' }}>{product.name}</TableCell>
                                            <TableCell className="font-mono text-xs text-gray-500" style={{ padding: '10px' }}>{product.sku}</TableCell>
                                            <TableCell className="text-gray-600" style={{ padding: '10px' }}>{product.category}</TableCell>
                                            <TableCell style={{ padding: '10px' }}>₹{product.price}</TableCell>
                                            <TableCell style={{ padding: '10px' }}>
                                                <span className={product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                    {product.stock}
                                                </span>
                                            </TableCell>
                                            <TableCell style={{ padding: '10px' }}>
                                                <Badge variant={getStatusVariant(product.status)}>
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right" style={{ padding: '10px' }}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                                                        <Edit className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                                            No products found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
  );
};

export default ProductsList;
