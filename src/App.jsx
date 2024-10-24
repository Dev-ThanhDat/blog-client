import FooterCom from '@/components/Footer';
import HeaderCom from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <ScrollToTop />
      <HeaderCom />
      <div className='pt-[65px]'>
        <Outlet />
      </div>
      <FooterCom />
    </>
  );
}

export default App;
