import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';

export const AdminAuthGuard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#10B981]" />
        <p className="text-xs text-muted-foreground font-mono">
          Verifying administrative authorization...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default AdminAuthGuard;
