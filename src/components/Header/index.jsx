import { postSignout } from '@/api/config';
import MoonIcon from '@/assets/icons/MoonIcon';
import SunIcon from '@/assets/icons/SunIcon';
import { toggleTheme } from '@/redux/theme/themeSlice';
import { signoutSuccess } from '@/redux/user/userSlice';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import { useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const HeaderCom = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.querySelector('html')?.classList.remove('light');
      document.querySelector('html')?.classList.add('dark');
    } else {
      document.querySelector('html')?.classList.remove('dark');
      document.querySelector('html')?.classList.add('light');
    }
  }, [theme]);

  const handleSignout = async () => {
    try {
      const response = await postSignout();
      if (response.success === false) {
        console.log(response.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className='fixed top-0 left-0 right-0 z-50 border-b-2'>
      <Link
        to='/'
        className='max-w-[90px] w-full inline-block'
      >
        <img
          src='/logo.png'
          alt=''
          className='object-cover w-full h-full'
        />
      </Link>
      <Button
        className='w-12 h-10 lg:hidden'
        color='gray'
        pill
      >
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='hidden w-14 sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button
              gradientDuoTone='purpleToBlue'
              outline
            >
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link
          active={path === '/'}
          as={'div'}
        >
          <Link
            to='/'
            className='inline-block w-full'
          >
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === '/search'}
          as={'div'}
        >
          <Link
            to='/search'
            className='inline-block w-full'
          >
            Search
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderCom;
