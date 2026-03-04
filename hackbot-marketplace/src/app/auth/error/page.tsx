export default function AuthError() {
  return (
    <div className="min-h-screen bg-hb-bg flex items-center justify-center">
      <div className="bg-hb-card border border-hb-border rounded-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-gray-400 mb-6">
          Something went wrong during sign in. Please try again.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-hb-accent text-hb-bg font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
