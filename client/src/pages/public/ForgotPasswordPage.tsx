import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-surface-border shadow-smooth text-center space-y-5">
          <Badge variant="primary">ACCOUNT RECOVERY</Badge>
          <h1 className="text-2xl font-bold text-ink-primary font-sans">Reset Your Password</h1>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Enter your registered email and our founder ops team will dispatch a secure password reset link.
          </p>

          {submitted ? (
            <div className="p-4 rounded-2xl bg-accent-emerald-light border border-accent-emerald-border text-xs text-emerald-800 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-accent-emerald mx-auto" />
              <div>If an account matches <strong>{email}</strong>, a password reset link has been dispatched.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-ink-primary mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. marcus@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-surface-border bg-white focus:border-accent-cobalt focus:ring-2 focus:ring-accent-cobalt/15 outline-none transition-all shadow-subtle"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-cobalt text-white font-semibold text-xs sm:text-sm hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow transition-all"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-2">
            <Link
              to="/login"
              className="text-xs text-ink-muted hover:text-ink-primary inline-flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
