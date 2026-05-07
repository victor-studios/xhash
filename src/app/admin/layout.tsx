'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { verifyAdminToken, AdminTokenPayload } from '@/lib/admin-auth';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import './admin-shared.css';

interface AdminContextType {
  admin: AdminTokenPayload | null;
  token: string | null;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({ admin: null, token: null, logout: () => {} });

export function useAdmin() {
  return useContext(AdminContext);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminTokenPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      // Verify token client-side (basic check — real verification happens on API calls)
      try {
        const adminData = JSON.parse(localStorage.getItem('admin_data') || '{}');
        if (adminData && adminData.adminId) {
          setAdmin(adminData);
          setToken(storedToken);
        } else {
          // Invalid data, clear
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_data');
          if (!isLoginPage) router.push('/admin/login');
        }
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        if (!isLoginPage) router.push('/admin/login');
      }
    } else {
      if (!isLoginPage) router.push('/admin/login');
    }
    setLoading(false);
  }, [isLoginPage, router]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    setAdmin(null);
    setToken(null);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
      }}>
        Loading...
      </div>
    );
  }

  // Login page — no sidebar
  if (isLoginPage) {
    return (
      <AdminContext.Provider value={{ admin, token, logout }}>
        {children}
      </AdminContext.Provider>
    );
  }

  // Not authenticated — redirect handled by useEffect
  if (!admin) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ admin, token, logout }}>
      <div className="admin-wrapper">
        <AdminSidebar admin={admin} />
        <div className="admin-main">
          {children}
        </div>
      </div>
    </AdminContext.Provider>
  );
}
