/**
 * pages/NotFoundPage.jsx — 404 page.
 */

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="text-8xl font-bold text-gray-700 mb-4">404</div>
      <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
      <p className="text-gray-400 text-sm mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
