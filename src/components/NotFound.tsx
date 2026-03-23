import { useRouter } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"

function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-slate-800 dark:text-slate-100">404</h1>
        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">
          Page Not Found
        </h2>
        <p className="max-w-md text-slate-500 dark:text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.history.back()}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 no-underline"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound