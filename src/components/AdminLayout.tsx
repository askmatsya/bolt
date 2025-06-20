'use client';

import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: 'dashboard' | 'orders' | 'inventory' | 'analytics';
  onPageChange: (page: 'dashboard' | 'orders' | 'inventory' | 'analytics') => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentPage,
  onPageChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'inventory', label: 'Products', icon: Package },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">AskMatsya Admin</h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <button className="w-full flex items-center space-x-3 p-4 rounded-lg text-left text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">AskMatsya Admin</h1>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id as any)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                      currentPage === item.id
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:p-8 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};