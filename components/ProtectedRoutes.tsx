'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Memoize allowedRoles to prevent dependency array issues
  const memoizedRoles = useMemo(() => allowedRoles, [allowedRoles?.join(',')]);

  useEffect(() => {
    // Set hydrated flag on client-side only
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = () => {
      try {
        // Check if authenticated
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Check role if specified
        if (memoizedRoles && memoizedRoles.length > 0) {
          const user = authService.getUser();
          if (!user || !memoizedRoles.includes(user.role)) {
            router.push('/unauthorized');
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router, memoizedRoles, isHydrated]);

  // Show loading while hydrating or checking auth
  if (!isHydrated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}