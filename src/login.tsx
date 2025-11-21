import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  FacebookAuthProvider,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ Already logged in → redirect to dashboard
        // navigate('/app', { replace: true });
        console.log('already login');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const signInWithGoogle = async () => {
    setAuthing(true);
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(response.user.uid);
      navigate('app', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setAuthing(false);
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setError(null);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response.user.uid);
      navigate('app');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setAuthing(false);
    }
  };

  const signInWithFacebook = async () => {
    setAuthing(true);
    try {
      const response = await signInWithPopup(auth, new FacebookAuthProvider());
      console.log('Facebook UID:', response.user.uid);
      navigate('app'); // go to your protected route
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setAuthing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md">
        <div className="relative rounded-2xl bg-white shadow-xl">
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white">
                🔒
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            <form className="grid gap-5" onSubmit={signInWithEmail}>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={authing}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {authing ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="relative my-2 flex items-center">
                <div className="h-px w-full bg-gray-200" />
                <span className="absolute left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-400">
                  or
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={authing}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={signInWithFacebook}
                  disabled={authing}
                  className="w-full rounded-lg border border-blue-600 bg-blue-600 text-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  Continue with Facebook
                </button>
              </div>

              {/* <div className="grid grid-cols-1 mt-2">
                <button
                  type="button"
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition opacity-50 cursor-not-allowed"
                >
                  Continue with GitHub (Coming Soon)
                </button>
              </div> */}
            </form>
          </div>

          {/* <div className="rounded-b-2xl border-t border-gray-200 px-8 py-6 text-center text-sm text-gray-500">
            Don’t have an account?{' '}
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create one
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
