import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  Search,
  User,
  MapPin,
  Star,
  Package,
  RefreshCw,
  AlertCircle,
  Save
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Artisan {
  id: string;
  name: string;
  bio: string | null;
  location: string;
  specialization: string[];
  verification_status: 'pending' | 'verified' | 'rejected';
  rating: number | null;
  total_products: number;
  is_active: boolean;
  created_at: string;
}

export const ArtisanManagement: React.FC = () => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    specialization: '',
    verification_status: 'pending' as 'pending' | 'verified' | 'rejected'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArtisans();
  }, []);

  const loadArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('artisans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtisans(data || []);
    } catch (error) {
      console.error('Error loading artisans:', error);
      setError('Failed to load artisans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const artisanData = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || null,
        location: formData.location.trim(),
        specialization: formData.specialization.split(',').map(s => s.trim()).filter(s => s),
        verification_status: formData.verification_status
      };

      if (editingArtisan) {
        // Update existing artisan
        const { data, error } = await supabase
          .from('artisans')
          .update({
            ...artisanData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingArtisan.id)
          .select()
          .single();

        if (error) throw error;

        setArtisans(artisans.map(artisan => 
          artisan.id === editingArtisan.id ? data : artisan
        ));
        setEditingArtisan(null);
      } else {
        // Create new artisan
        const { data, error } = await supabase
          .from('artisans')
          .insert({
            ...artisanData,
            rating: null,
            total_products: 0,
            is_active: true
          })
          .select()
          .single();

        if (error) throw error;

        setArtisans([data, ...artisans]);
        setShowAddForm(false);
      }

      // Reset form
      setFormData({
        name: '',
        bio: '',
        location: '',
        specialization: '',
        verification_status: 'pending'
      });
    } catch (error) {
      console.error('Error saving artisan:', error);
      alert('Failed to save artisan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleArtisanStatus = async (artisanId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('artisans')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', artisanId);

      if (error) throw error;
      
      setArtisans(artisans.map(artisan => 
        artisan.id === artisanId 
          ? { ...artisan, is_active: !currentStatus }
          : artisan
      ));
    } catch (error) {
      console.error('Error toggling artisan status:', error);
      alert('Failed to update artisan status.');
    }
  };

  const updateVerificationStatus = async (artisanId: string, status: 'pending' | 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('artisans')
        .update({ 
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', artisanId);

      if (error) throw error;
      
      setArtisans(artisans.map(artisan => 
        artisan.id === artisanId 
          ? { ...artisan, verification_status: status }
          : artisan
      ));
    } catch (error) {
      console.error('Error updating verification status:', error);
      alert('Failed to update verification status.');
    }
  };

  const startEdit = (artisan: Artisan) => {
    setEditingArtisan(artisan);
    setFormData({
      name: artisan.name,
      bio: artisan.bio || '',
      location: artisan.location,
      specialization: artisan.specialization.join(', '),
      verification_status: artisan.verification_status
    });
    setShowAddForm(false);
  };

  const startAdd = () => {
    setEditingArtisan(null);
    setFormData({
      name: '',
      bio: '',
      location: '',
      specialization: '',
      verification_status: 'pending'
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingArtisan(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      bio: '',
      location: '',
      specialization: '',
      verification_status: 'pending'
    });
  };

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artisan.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || artisan.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">Artisans Error</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={loadArtisans}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Artisan Management</h2>
          <div className="flex space-x-3">
            <button
              onClick={loadArtisans}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 font-medium flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={startAdd}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 font-medium flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Artisan</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search artisans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingArtisan) && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingArtisan ? 'Edit Artisan' : 'Add New Artisan'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artisan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Master Weaver Raghunath Das"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Varanasi, Uttar Pradesh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief description of the artisan's background and expertise..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Banarasi Silk, Brocade Work, Traditional Weaving"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    verification_status: e.target.value as 'pending' | 'verified' | 'rejected'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
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
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Artisan'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Artisans Grid */}
      {filteredArtisans.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first artisan to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((artisan) => (
            <div key={artisan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Artisan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{artisan.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {artisan.location}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => startEdit(artisan)}
                    className="p-1 text-gray-400 hover:text-orange-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleArtisanStatus(artisan.id, artisan.is_active)}
                    className={`p-1 ${artisan.is_active ? 'text-gray-400 hover:text-gray-600' : 'text-green-400 hover:text-green-600'}`}
                  >
                    {artisan.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bio */}
              {artisan.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{artisan.bio}</p>
              )}

              {/* Specialization */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">SPECIALIZATION</h4>
                <div className="flex flex-wrap gap-1">
                  {artisan.specialization.slice(0, 3).map((skill) => (
                    <span key={skill} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {artisan.specialization.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      +{artisan.specialization.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-1" />
                  <span>{artisan.total_products} products</span>
                </div>
                {artisan.rating && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>{artisan.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Status and Verification */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  artisan.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                  artisan.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {artisan.verification_status}
                </span>

                <div className="flex space-x-1">
                  <button
                    onClick={() => updateVerificationStatus(artisan.id, 'verified')}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                    title="Verify"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => updateVerificationStatus(artisan.id, 'rejected')}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    title="Reject"
                  >
                    ✗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};