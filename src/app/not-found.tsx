import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 rounded-2xl border bg-white shadow-xl p-6">
        <div className="flex mb-4 gap-2 items-center">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" d="M12 8v4m0 4h.01" strokeWidth="2"/></svg>
          <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        </div>
        <p className="mt-4 text-sm text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">← Back to Home</Link>
      </div>
    </div>
  );
}
