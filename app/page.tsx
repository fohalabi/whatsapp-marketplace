import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Welcome Back To Your Dahboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Select your dashboard to continue
        </p>
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            ⚠️ This will be the login page. Currently showing quick links for development.
          </p>
        </div>

        <div className="space-y-8">
          <Link href="/admin/dashboard">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg">
              Admin Dashboard
            </button>
          </Link>

          <Link href="/merchant/dashboard">
            <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg">
              Merchant Dashboard
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}