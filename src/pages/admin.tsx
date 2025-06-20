'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { InventoryManagement } from '@/components/admin/InventoryManagement';
import { BarChart3 } from 'lucide-react';

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'orders' | 'inventory' | 'analytics'>('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'analytics':
        return (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">Detailed analytics and reporting features will be available soon.</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderContent()}
    </AdminLayout>
  );
}