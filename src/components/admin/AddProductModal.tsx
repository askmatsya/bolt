import React, { useState } from 'react';
import { X, Save, Package, Plus, Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AIProductAssistant } from '../../services/aiProductAssistant';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Artisan {
  id: string;
  name: string;
  location: string;
}

interface AddProductModalProps {
  categories: Category[];
  artisans: Artisan[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProduct: any) => void;
  onVoiceCacheRefresh?: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  categories,
  artisans,
  isOpen,
  onClose,
  onSave,
  onVoiceCacheRefresh
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    price_range: '',
    origin: '',
    image_url: '',
    cultural_significance: '',
    craft_time: '',
    tags: '',
    occasions: '',
    materials: '',
    category_id: '',
    artisan_id: '',
    is_active: true
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAssistant] = useState(new AIProductAssistant());
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        price_range: formData.price_range.trim(),
        origin: formData.origin.trim(),
        image_url: formData.image_url.trim(),
        cultural_significance: formData.cultural_significance.trim(),
        craft_time: formData.craft_time.trim() || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        occasions: formData.occasions.split(',').map(occ => occ.trim()).filter(occ => occ),
        materials: formData.materials.split(',').map(mat => mat.trim()).filter(mat => mat),
        category_id: formData.category_id || null,
        artisan_id: formData.artisan_id || null,
        is_active: formData.is_active
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select(`
          *,
          categories (name, slug),
          artisans (name, location)
        `)
        .single();

      if (error) throw error;

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        price_range: '',
        origin: '',
        image_url: '',
        cultural_significance: '',
        craft_time: '',
        tags: '',
        occasions: '',
        materials: '',
        category_id: '',
        artisan_id: '',
        is_active: true
      });

      onSave(data);

      // Refresh voice search cache immediately
      if (onVoiceCacheRefresh) {
        onVoiceCacheRefresh();
      }

      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIGenerate = async () => {
    if (!formData.name.trim() || !formData.category_id) {
      alert('Please enter a product name and select a category first');
      return;
    }

    setGeneratingAI(true);
    
    try {
      // Find the selected category
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      if (!selectedCategory) return;

      // Generate AI suggestions
      const suggestions = aiAssistant.generateSuggestions(formData.name, selectedCategory.slug);
      
      // Update form with AI suggestions
      setFormData(prev => ({
        ...prev,
        description: suggestions.description,
        cultural_significance: suggestions.culturalSignificance,
        origin: suggestions.origin,
        image_url: suggestions.imageUrl,
        tags: suggestions.tags.join(', '),
        occasions: suggestions.occasions.join(', '),
        materials: suggestions.materials.join(', '),
        craft_time: suggestions.craftTime,
        price_range: suggestions.priceRange,
        price: suggestions.suggestedPrice
      }));
      
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI suggestions. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* AI Assistant Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-purple-800 mb-1">
                  🤖 AI Product Assistant
                </h3>
                <p className="text-xs text-purple-700">
                  Enter a product name and category, then let AI generate description, cultural significance, images, and more!
                </p>
              </div>
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={generatingAI || !formData.name.trim() || !formData.category_id}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                {generatingAI ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{generatingAI ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Banarasi Silk Saree"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artisan
                </label>
                <select
                  value={formData.artisan_id}
                  onChange={(e) => handleInputChange('artisan_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select an artisan (optional)</option>
                  {artisans.map((artisan) => (
                    <option key={artisan.id} value={artisan.id}>
                      {artisan.name} - {artisan.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cultural Significance *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.cultural_significance}
                  onChange={(e) => handleInputChange('cultural_significance', e.target.value)}
                  placeholder="Explain the cultural importance and history..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin *
                </label>
                <input
                  type="text"
                  required
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., Varanasi, Uttar Pradesh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Pricing and Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing & Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price_range}
                  onChange={(e) => handleInputChange('price_range', e.target.value)}
                  placeholder="$180 - $420"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://images.pexels.com/photos/... (AI will suggest)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Craft Time
                </label>
                <input
                  type="text"
                  value={formData.craft_time}
                  onChange={(e) => handleInputChange('craft_time', e.target.value)}
                  placeholder="e.g., 45-60 days"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Product is active
                </label>
              </div>
            </div>
          </div>

          {/* Tags and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="silk, handwoven, bridal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Occasions
              </label>
              <input
                type="text"
                value={formData.occasions}
                onChange={(e) => handleInputChange('occasions', e.target.value)}
                placeholder="wedding, festival, ceremony"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materials
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => handleInputChange('materials', e.target.value)}
                placeholder="Pure Silk, Gold Thread"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};