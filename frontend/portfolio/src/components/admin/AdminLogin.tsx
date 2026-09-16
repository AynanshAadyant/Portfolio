import React, { useState } from 'react';
import { ShieldLock, KeyRound, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#FAFAFA] transition-colors mb-6"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-[#121216] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Subtle green glow in background */}
          <div className="absolute -top-24 -right-24 size-48 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="size-12 rounded-xl bg-[#18181B] border border-white/10 mx-auto flex items-center justify-center text-[#10B981] mb-4 shadow-inner">
              <ShieldLock className="size-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#FAFAFA]">Admin CMS Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Authorized access only. Enter your administrative password to manage portfolio content.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <span className="font-semibold">Access Denied:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound className="size-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  autoFocus
                  className="w-full pl-9 pr-10 py-2.5 bg-[#18181B] border border-white/10 rounded-lg text-sm text-[#FAFAFA] placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-[#FAFAFA] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-2.5 px-4 rounded-lg bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0C] font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#10B981]/20 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Unlock CMS Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-muted-foreground/60">
              Secured with JWT authentication and HTTP-only cookie validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
