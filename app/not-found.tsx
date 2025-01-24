export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}