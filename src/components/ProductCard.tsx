import React from 'react';
import { MapPin, Clock, User, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onLearnMore: (product: Product) => void;
  onOrder: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onLearnMore, onOrder }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-2xl font-bold text-orange-600">{product.priceRange}</p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span>{product.origin}</span>
          </div>
          {product.artisan && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-orange-500" />
              <span>{product.artisan}</span>
            </div>
          )}
          {product.craftTime && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-orange-500" />
              <span>Craft time: {product.craftTime}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onLearnMore(product)}
            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-lg py-2 px-4 text-sm font-medium transition-colors duration-200"
          >
            Learn More
          </button>
          <button
            onClick={() => onOrder(product)}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};