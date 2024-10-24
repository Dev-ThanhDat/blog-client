import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className='flex flex-col items-center justify-center h-screen gap-6 p-5'>
      <h1 className='font-extrabold md:text-[45px] text-[35px] text-center leading-[1.4]'>
        Page not found. &#128531;
      </h1>
      <ul className='text-center'>
        <li className='font-bold md:leading-[1.6] leading-[1.4] text-center '>
          The URL for this page has been changed or no longer exists.
        </li>
        <li className='font-bold md:leading-[1.6] leading-[1.4] text-center '>
          Try accessing it again from the home page.
        </li>
      </ul>
      <Link
        to={'/'}
        className='px-4 py-2 font-bold text-teal-500 uppercase transition-all border border-teal-500 rounded-full hover:bg-teal-500 hover:text-white'
      >
        Back to home
      </Link>
    </section>
  );
};

export default NotFound;
