import Sidebar from '@/components/Dashboard/Sidebar';
import './dashboard-shared.css';

export const metadata = {
  title: 'Dashboard — XHash',
  description: 'Manage your mining portfolio, deposits, withdrawals, and account settings.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
