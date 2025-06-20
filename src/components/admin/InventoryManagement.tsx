'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  Search,
  Package,
  DollarSign,
  MapPin,
  Tag
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_range: string;
  origin: string;
  image_url: string;
  tags: string[];
  is_active: boolean;
  categories: {
    name: string;
    slug: string;
  };
  artisans?: {
    name: string;
    location: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const InventoryManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories (name, slug),
          artisans (name, location)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (categoriesError) throw categoriesError;

      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;
      
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_active: !currentStatus }
          : product
      ));
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categories.slug === selectedCategory;
    const matchesStatus = !showActiveOnly || product.is_active;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getProductStats = () => {
    return {
      total: products.length,
      active: products.filter(p => p.is_active).length,
      inactive: products.filter(p => !p.is_active).length,
      categories: categories.length,
    };
  };

  const stats = getProductStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Product Management</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 font-medium flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Products</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <EyeOff className="w-8 h-8 text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Tag className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Categories</p>
                <p className="text-2xl font-bold text-purple-900">{stats.categories}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowActiveOnly(!showActiveOnly)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showActiveOnly
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showActiveOnly ? 'Active Only' : 'Show All'}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleProductStatus(product.id, product.is_active)}
                  className={`p-2 rounded-full shadow-md ${
                    product.is_active
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}
                >
                  {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {product.categories.name}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1 text-orange-500" />
                  <span className="font-medium text-orange-600">{product.price_range}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                  <span>{product.origin}</span>
                </div>
                
                {product.artisans && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-1 text-orange-500" />
                    <span>{product.artisans.name}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    +{product.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-3 text-sm font-medium"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => toggleProductStatus(product.id, product.is_active)}
                  className={`flex-1 rounded-lg py-2 px-3 text-sm font-medium ${
                    product.is_active
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {product.is_active ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};