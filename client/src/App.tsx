import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { JoinWaitlistPage } from './pages/public/JoinWaitlistPage';
import { StartProjectPage } from './pages/public/StartProjectPage';
import { AvailabilityConfirmPage } from './pages/public/AvailabilityConfirmPage';
import { LoginPage } from './pages/public/LoginPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Talent Pages
import { TalentDashboard } from './pages/talent/TalentDashboard';
import { TalentInvitationDetail } from './pages/talent/TalentInvitationDetail';
import { TalentProjectWorkspace } from './pages/talent/TalentProjectWorkspace';
import { TalentPayouts } from './pages/talent/TalentPayouts';
import { TalentProfilePage } from './pages/talent/TalentProfile';

// Client Pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientProjectWorkspace } from './pages/client/ClientProjectWorkspace';
import { ClientNewProject } from './pages/client/ClientNewProject';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTalentCRM } from './pages/admin/AdminTalentCRM';
import { AdminProjectsList } from './pages/admin/AdminProjectsList';
import { AdminProjectScoping } from './pages/admin/AdminProjectScoping';
import { AdminPodAssembler } from './pages/admin/AdminPodAssembler';
import { AdminQAGateAndPayoutLedger } from './pages/admin/AdminQAGateAndPayoutLedger';

const ProtectedRoute: React.FC<{
  allowedRoles: ('ADMIN' | 'TALENT' | 'CLIENT')[];
  children: React.ReactNode;
}> = ({ allowedRoles, children }) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-ink-muted">
        Verifying authorization...
      </div>
    );
  }

  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Redirect to user's matching portal
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'CLIENT') return <Navigate to="/client/dashboard" replace />;
    return <Navigate to="/talent/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Website */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/join" element={<JoinWaitlistPage />} />
          <Route path="/start-project" element={<StartProjectPage />} />
          <Route path="/availability/:token" element={<AvailabilityConfirmPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Talent Bench Portal */}
          <Route
            path="/talent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['TALENT']}>
                <TalentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talent/invitations/:id"
            element={
              <ProtectedRoute allowedRoles={['TALENT']}>
                <TalentInvitationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talent/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['TALENT']}>
                <TalentProjectWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talent/payouts"
            element={
              <ProtectedRoute allowedRoles={['TALENT']}>
                <TalentPayouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talent/profile"
            element={
              <ProtectedRoute allowedRoles={['TALENT']}>
                <TalentProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Client Portal */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projects/new"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientNewProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientProjectWorkspace />
              </ProtectedRoute>
            }
          />

          {/* Founder / Admin Ops Console */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/talent"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminTalentCRM />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminProjectsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id/scope"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminProjectScoping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id/pod"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPodAssembler />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects/:id/qa"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminQAGateAndPayoutLedger />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
  );
};

export default App;
