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
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // all, in_stock, out_of_stock
  const [showFilters, setShowFilters] = useState(false);

  // Categories for dropdown (In real app, fetch from API)
  const categories = ["All", "Fever & Pain", "Antibiotics", "Vitamins & Supplements", "Stomach Care", "Skin Care", "Devices"];

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = {
        query: searchQuery,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        inStock: stockFilter === 'all' ? undefined : (stockFilter === 'in_stock'),
      };
      
      const response = await productService.getProducts(params);
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
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, minPrice, maxPrice, stockFilter]);

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

  const getStatusVariant = (status, stock) => {
      // Logic to determine status badge color based on stock or status string
      if (stock === 0) return 'destructive';
      if (stock < 10) return 'warning';
      return 'success';
  };

  const getStatusText = (status, stock) => {
      if (stock === 0) return 'Out of Stock';
      if (stock < 10) return 'Low Stock';
      return 'Active';
  }

  const clearFilters = () => {
      setSearchQuery('');
      setSelectedCategory('All');
      setMinPrice('');
      setMaxPrice('');
      setStockFilter('all');
  }

  return (
        <div className="space-y-4 sm:space-y-6 min-h-screen" style={{ padding: '10px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
            <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-4" style={{ paddingBottom: '10px' }}>
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">Manage your pharmacy inventory</p>
                </div>
                <Button onClick={() => navigate('/admin/products/new')} className="text-[10px] sm:text-[8px] sm:text-xs md:text-sm h-7 sm:h-9 md:h-10" style={{ padding: '0px 10px' }}>
                    <Plus className="mr-0.5 sm:mr-1 md:mr-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"  /> <span style={{ marginTop: '3px' }}>Add Product</span>
                </Button>
            </div>

            <Card>
                <CardContent className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4" style={{ padding: '5px' }}>
                    {/* Filters & Search Bar */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2 sm:gap-4" style={{ paddingBottom: '5px' }}>
                            <div className="relative flex-1">
                                <Search className="absolute right-2.5 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                <Input
                                    placeholder="Search by name, generic name, or SKU..."
                                    className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ padding: '15px' }}
                                />
                            </div>
                            <Button 
                                variant={showFilters ? "secondary" : "outline"} 
                                onClick={() => setShowFilters(!showFilters)}
                                className="shrink-0 text-[8px] sm:text-sm h-9 sm:h-10" 
                                style={{ padding: '0px 10px' }}
                            >
                                <Filter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                <span style={{ marginTop: '3px' }}>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                            </Button>
                        </div>
                        
                        {/* Advanced Filters Area */}
                        {showFilters && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                {/* Category Filter */}
                                <div className="space-y-1">
                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">Category</label>
                                    <select 
                                        className="w-full h-8 sm:h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="space-y-1">
                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">Price Range (₹)</label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            placeholder="Min" 
                                            className="h-8 sm:h-9 text-[10px] sm:text-sm"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                        <span className="text-gray-400">-</span>
                                        <Input 
                                            type="number" 
                                            placeholder="Max" 
                                            className="h-8 sm:h-9 text-[10px] sm:text-sm"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Stock Filter */}
                                <div className="space-y-1">
                                    <label className="text-[10px] sm:text-xs font-medium text-gray-600">Stock Status</label>
                                    <select 
                                        className="w-full h-8 sm:h-9 rounded-md border border-gray-200 bg-white px-3 py-1 text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        value={stockFilter}
                                        onChange={(e) => setStockFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="in_stock">In Stock</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                                
                                {/* Reset Button */}
                                <div className="flex items-end">
                                    <Button 
                                        variant="ghost" 
                                        onClick={clearFilters}
                                        className="w-full h-8 sm:h-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        style={{ marginTop: '20px' }}
                                    >
                                        <span style={{ marginTop: '3px' }}>Reset Filters</span>
                                    </Button>
                                </div>
                             </div>
                        )}
                    </div>

                    {/* Products Table */}
                    <div className="rounded-md border border-gray-200 p-2 overflow-x-auto">
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
                                            <div className="flex items-center justify-center gap-2 text-emerald-600">
                                                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"/>
                                                <span>Loading products...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : products.length > 0 ? (
                                    products.map((product, index) => (
                                        <TableRow 
                                            key={product.id}
                                            className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100 group"
                                            style={{ 
                                                marginBottom: index !== products.length - 1 ? '10px' : '0',
                                            }}
                                        >
                                            <TableCell className="font-medium text-gray-900 text-[8px] sm:text-sm" style={{ padding: '8px' }}>
                                                <div className="flex flex-col">
                                                    <span>{product.name}</span>
                                                    <span className="text-[8px] text-gray-400 sm:hidden">{product.manufacturer}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-[8px] sm:text-xs text-gray-500 hidden md:table-cell" style={{ padding: '8px' }}>{product.id}</TableCell>
                                            <TableCell className="text-gray-600 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px' }}>{product.category}</TableCell>
                                            <TableCell className="text-[8px] sm:text-sm font-semibold text-emerald-600" style={{ padding: '8px' }}>₹{product.price}</TableCell>
                                            <TableCell className="text-[8px] sm:text-sm hidden lg:table-cell" style={{ padding: '8px' }}>
                                                <span className={product.stock < 10 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                                                    {product.stock} units
                                                </span>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell" style={{ padding: '8px' }}>
                                                <Badge variant={getStatusVariant(product.status, product.stock)} className="text-[8px] sm:text-xs">
                                                    {getStatusText(product.status, product.stock)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right" style={{ padding: '8px' }}>
                                                <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Package className="w-8 h-8 text-gray-300" />
                                                <p>No products found matching your search.</p>
                                                <Button size="sm" variant="link" className="text-emerald-600" onClick={clearFilters}>Clear all filters</Button>
                                            </div>
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
