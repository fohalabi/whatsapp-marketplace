import ProtectedRoute from '@/components/ProtectedRoutes';
import { MerchantSidebar } from '@/components/merchant/sidebar/Sidebar';

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['MERCHANT']}>
      <div className="min-h-screen flex">
        <MerchantSidebar />
        <main className="flex-1 min-h-screen flex flex-col bg-gray-200 dark:bg-gray-900 pt-16 lg:pt-0 lg:ml-64">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}