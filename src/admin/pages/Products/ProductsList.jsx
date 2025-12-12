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
        <div className="space-y-4 sm:space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
            <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-4" style={{ paddingBottom: '10px' }}>
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">Manage your pharmacy inventory</p>
                </div>
                <Button onClick={() => navigate('/admin/products/new')} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10" style={{ padding: '0px 5px' }}>
                    <Plus className="mr-0.5 sm:mr-1 md:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"  /> <span style={{ marginTop: '3px' }}>Add Product</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4" style={{ padding: '5px' }}>
                    {/* Filters & Search */}
                    <div className="flex flex-row gap-2 sm:gap-4" style={{ paddingBottom: '5px' }}>
                        <div className="relative flex-1">
                            <Search className="absolute right-2.5 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: '15px' }}
                            />
                        </div>
                        <Button variant="outline" className="shrink-0 text-[8px] sm:text-sm h-9 sm:h-10" style={{ padding: '0px 5px' }}>
                            <Filter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            <span style={{ marginTop: '3px' }}>Filter</span>
                        </Button>
                    </div>

                    {/* Products Table */}
                    <div className="rounded-md border border-gray-200 p-2">
                        <Table>
                            <TableHeader>
                                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '6px 8px' }}>SKU</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '6px 8px' }}>Category</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Price</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden lg:table-cell" style={{ padding: '6px 8px' }}>Stock</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '6px 8px' }}>Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '6px 8px' }}>Actions</TableHead>
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
                                            <TableCell className="font-medium text-gray-900 text-[8px] sm:text-sm" style={{ padding: '8px' }}>{product.name}</TableCell>
                                            <TableCell className="font-mono text-[8px] sm:text-xs text-gray-500 hidden md:table-cell" style={{ padding: '8px' }}>{product.sku}</TableCell>
                                            <TableCell className="text-gray-600 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px' }}>{product.category}</TableCell>
                                            <TableCell className="text-[8px] sm:text-sm" style={{ padding: '8px' }}>₹{product.price}</TableCell>
                                            <TableCell className="text-[8px] sm:text-sm hidden lg:table-cell" style={{ padding: '8px' }}>
                                                <span className={product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                                    {product.stock}
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell" style={{ padding: '8px' }}>
                                                <Badge variant={getStatusVariant(product.status)} className="text-[8px] sm:text-xs">
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right" style={{ padding: '8px' }}>
                                                <div className="flex items-center justify-end gap-1 sm:gap-2">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
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
