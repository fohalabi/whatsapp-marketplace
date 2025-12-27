'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check if authenticated
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      // Check role if specified
      if (allowedRoles && allowedRoles.length > 0) {
        const user = authService.getUser();
        if (!user || !allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, allowedRoles]);

  // Show loading or nothing while checking
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}