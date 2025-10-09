import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockAdminAPI } from '@/services/mockData';
import { toast } from 'sonner';
import { Package, Search, Calendar } from 'lucide-react';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, [filterStatus]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        status: filterStatus !== 'all' ? filterStatus : null
      };
      const data = await mockAdminAPI.getAllDonations(params);
      setDonations(data.donations);
    } catch (error) {
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.food_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.ngo_name && donation.ngo_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-orange-100 text-orange-700 border-orange-300',
      claimed: 'bg-blue-100 text-blue-700 border-blue-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="donation-management">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
        <p className="text-gray-600">Track and manage all donations</p>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by food type, restaurant, or NGO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
                data-testid="donation-search-input"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-11" data-testid="donation-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Donations Table */}
      <Card className="border-2" data-testid="donations-table">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            All Donations ({filteredDonations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Food Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    NGO (Claimed By)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pickup Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No donations found
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr 
                      key={donation.id} 
                      className="hover:bg-gray-50 transition-colors"
                      data-testid={`donation-row-${donation.id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">{donation.food_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">{donation.quantity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{donation.restaurant_name}</div>
                          <div className="text-gray-500 text-xs">{donation.restaurant_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {donation.ngo_name ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{donation.ngo_name}</div>
                            <div className="text-gray-500 text-xs">{donation.ngo_email}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Not claimed yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant="outline" 
                          className={`font-semibold capitalize ${getStatusColor(donation.status)}`}
                        >
                          {donation.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(donation.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(donation.pickup_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-orange-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Active</p>
              <p className="text-3xl font-bold text-orange-600">
                {donations.filter(d => d.status === 'active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Claimed</p>
              <p className="text-3xl font-bold text-blue-600">
                {donations.filter(d => d.status === 'claimed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {donations.filter(d => d.status === 'completed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-emerald-200">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Food</p>
              <p className="text-3xl font-bold text-emerald-600">
                {donations.reduce((sum, d) => sum + (d.quantity_kg || 0), 0)} kg
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationManagement;