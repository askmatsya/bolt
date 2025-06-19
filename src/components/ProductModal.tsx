import React from 'react';
import { X, MapPin, User, Clock, Star, Heart, ShoppingCart, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onOrder }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-2xl font-bold text-orange-600">{product.priceRange}</p>
            </div>
            <button className="bg-orange-50 p-3 rounded-full hover:bg-orange-100 transition-colors">
              <Heart className="w-6 h-6 text-orange-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Details</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-orange-500" />
                  <span><strong>Origin:</strong> {product.origin}</span>
                </div>
                {product.artisan && (
                  <div className="flex items-center text-gray-700">
                    <User className="w-5 h-5 mr-3 text-orange-500" />
                    <span><strong>Artisan:</strong> {product.artisan}</span>
                  </div>
                )}
                {product.craftTime && (
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-5 h-5 mr-3 text-orange-500" />
                    <span><strong>Craft Time:</strong> {product.craftTime}</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Materials Used</h4>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material) => (
                    <span key={material} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Perfect For</h4>
                <div className="flex flex-wrap gap-2">
                  {product.occasions.map((occasion) => (
                    <span key={occasion} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center mb-4">
                  <Info className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Cultural Significance</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{product.culturalSignificance}</p>
              </div>

              <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Star className="w-5 h-5 text-green-600 mr-2" />
                  Authenticity Guarantee
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>✅ Direct from artisan/verified seller</li>
                  <li>✅ Traditional crafting methods</li>
                  <li>✅ Quality materials certification</li>
                  <li>✅ Cultural authenticity verified</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onOrder(product)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl py-4 px-6 text-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Now via WhatsApp
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl py-4 px-6 text-lg font-semibold transition-colors duration-200">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};