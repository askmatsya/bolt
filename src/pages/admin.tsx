import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { OrderManagement } from '../components/admin/OrderManagement';
import { InventoryManagement } from '../components/admin/InventoryManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { ArtisanManagement } from '../components/admin/ArtisanManagement';
import { BarChart3, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { populateSampleData } from '../services/sampleData';
import { whatsappService } from '../services/whatsapp';

export default function AdminPage() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'orders' | 'inventory' | 'categories' | 'artisans' | 'analytics'>('dashboard');
  const [isPopulating, setIsPopulating] = useState(false);
  const [populationResult, setPopulationResult] = useState<any>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Function to communicate cache refresh to main app
  const handleVoiceCacheRefresh = () => {
    // Post message to parent window (main app) to refresh voice cache
    if (window.opener) {
      window.opener.postMessage({ type: 'REFRESH_VOICE_CACHE' }, '*');
    }
    
    // If not opened in popup, try direct refresh via localStorage event
    localStorage.setItem('voiceCacheRefresh', Date.now().toString());
  };
  const handlePopulateSampleData = async () => {
    setIsPopulating(true);
    setPopulationResult(null);
    
    try {
      const result = await populateSampleData();
      setPopulationResult(result);
      
      // Refresh voice cache after populating sample data
      if (result.success) {
        handleVoiceCacheRefresh();
      }
    } catch (error) {
      setPopulationResult({ success: false, error });
    } finally {
      setIsPopulating(false);
    }
  };

  const testWhatsAppConnection = async () => {
    const result = await whatsappService.testConnection();
    setWhatsappStatus(result);
  };

  // Test WhatsApp connection on component mount
  useEffect(() => {
    testWhatsAppConnection();
  }, []);

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Data Setup Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Admin Panel Setup
                  </h3>
                  <p className="text-blue-700 mb-4">
                    This admin panel connects to your Supabase database. If you're seeing empty data, 
                    you can populate the database with sample products, orders, and categories for testing.
                  </p>
                  
                  {populationResult && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      populationResult.success 
                        ? 'bg-green-100 border border-green-200' 
                        : 'bg-red-100 border border-red-200'
                    }`}>
                      <div className="flex items-center mb-2">
                        {populationResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        )}
                        <span className={`font-medium ${
                          populationResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {populationResult.success ? 'Sample Data Added Successfully!' : 'Failed to Add Sample Data'}
                        </span>
                      </div>
                      {populationResult.success && populationResult.data && (
                        <div className="text-sm text-green-700">
                          <p>• {populationResult.data.categories} Categories</p>
                          <p>• {populationResult.data.products} Products</p>
                          <p>• {populationResult.data.artisans} Artisans</p>
                          <p>• {populationResult.data.orders} Orders</p>
                        </div>
                      )}
                      {!populationResult.success && (
                        <p className="text-sm text-red-700">
                          {populationResult.error?.message || 'Unknown error occurred'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handlePopulateSampleData}
                  disabled={isPopulating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                >
                  {isPopulating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Database className="w-5 h-5" />
                  )}
                  <span>
                    {isPopulating ? 'Adding Sample Data...' : 'Add Sample Data'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* WhatsApp Integration Status */}
            <div className={`border rounded-lg p-4 ${
              whatsappStatus?.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${
                    whatsappStatus?.success ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    📱 WhatsApp Integration Status
                  </h3>
                  <p className={`text-sm ${
                    whatsappStatus?.success ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {whatsappStatus?.message || 'Testing connection...'}
                  </p>
                  {!whatsappStatus?.success && (
                    <p className="text-xs text-yellow-600 mt-2">
                      ⚠️ Using WhatsApp Web fallback. Orders will still work but will open WhatsApp in browser.
                    </p>
                  )}
                </div>
                <button
                  onClick={testWhatsAppConnection}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    whatsappStatus?.success 
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  Test Again
                </button>
              </div>
            </div>
            
            <AdminDashboard onNavigate={setCurrentPage} />
          </div>
        );
      case 'orders':
        return <OrderManagement />;
      case 'inventory':
        return <InventoryManagement onVoiceCacheRefresh={handleVoiceCacheRefresh} />;
      case 'categories':
        return <CategoryManagement />;
      case 'artisans':
        return <ArtisanManagement />;
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