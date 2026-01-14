'use client';

import { useState, useEffect } from 'react';
import { riderApprovalService } from '@/services/riderApproval.service';
import { UserCheck, Bike, Filter, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber?: string;
  licensePlate?: string;
  approvalStatus: string;
  rejectionReason?: string;
  createdAt: string;
  user: {
    email: string;
    phone: string;
  };
}

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRiders();
  }, [selectedStatus]);

  const fetchRiders = async () => {
    try {
      const status = selectedStatus === 'ALL' ? undefined : selectedStatus;
      const response = await riderApprovalService.getAllRiders(status);
      setRiders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch riders:', error);
      toast.error('Failed to load riders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (riderId: string) => {
    try {
      await riderApprovalService.approveRider(riderId);
      toast.success('Rider approved successfully');
      fetchRiders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve rider');
    }
  };

  const handleReject = async () => {
    if (!selectedRider || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await riderApprovalService.rejectRider(selectedRider, rejectionReason);
      toast.success('Rider rejected');
      setShowRejectModal(false);
      setSelectedRider(null);
      setRejectionReason('');
      fetchRiders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject rider');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Bike className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading riders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rider Management</h1>
        <p className="text-gray-600">Approve or reject rider applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filter by Status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {riders.filter(r => r.approvalStatus === 'PENDING').length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {riders.filter(r => r.approvalStatus === 'APPROVED').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {riders.filter(r => r.approvalStatus === 'REJECTED').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Riders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riders.map((rider) => (
                <tr key={rider.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bike className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {rider.firstName} {rider.lastName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{rider.phone}</p>
                    <p className="text-sm text-gray-500">{rider.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{rider.vehicleType}</p>
                    <p className="text-sm text-gray-500">{rider.licensePlate || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(rider.approvalStatus)}
                    {rider.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">{rider.rejectionReason}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(rider.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rider.approvalStatus === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(rider.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRider(rider.id);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {riders.length === 0 && (
          <div className="text-center py-12">
            <Bike className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No riders found</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Rider</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="e.g., Invalid license, Incomplete documents..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRider(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}