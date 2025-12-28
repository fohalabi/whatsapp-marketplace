'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    const user = authService.getUser();
    
    if (user?.role === 'MERCHANT') {
      router.push('/merchant/dashboard');
    } else if (['ADMIN', 'MANAGER', 'SUPPORT'].includes(user?.role)) {
      router.push('/admin/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        <button
          onClick={handleGoBack}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}