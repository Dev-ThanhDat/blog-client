import DashboardComp from '@/components/DashboardComp';
import DashComments from '@/components/DashComments';
import DashPosts from '@/components/DashPosts';
import DashProfile from '@/components/DashProfile';
import DashSidebar from '@/components/DashSidebar';
import DashUsers from '@/components/DashUsers';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  const tab = useMemo(
    () => new URLSearchParams(location.search).get('tab') || '',
    [location.search]
  );

  return (
    <div className='flex flex-col min-h-screen md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {tab === 'dash' && <DashboardComp />}
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'comments' && <DashComments />}
    </div>
  );
};

export default Dashboard;
