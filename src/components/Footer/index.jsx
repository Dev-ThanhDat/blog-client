import { Footer, Tooltip } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { BsPassportFill } from 'react-icons/bs';

const FooterCom = () => {
  return (
    <Footer
      container
      className='border border-t-8 border-teal-500'
    >
      <div className='w-full mx-auto max-w-7xl'>
        <div className='flex flex-col items-center justify-between gap-5 md:flex-row'>
          <div className='mt-5'>
            <Link
              to='/'
              className='max-w-[70px] w-full inline-block'
            >
              <img
                src='/logo.png'
                alt=''
                className='object-cover w-full h-full'
              />
            </Link>
          </div>
          <div className='flex items-center justify-between gap-5 flex-nowrap'>
            <Footer.Copyright
              by='Thanh Dat'
              year={new Date().getFullYear()}
            />
            <div className='flex items-center gap-6'>
              <Tooltip content='Linkedin'>
                <Footer.Icon
                  href='https://www.linkedin.com/in/pham-thanh-dat-b194b5238/'
                  target='_bland'
                  icon={FaLinkedin}
                />
              </Tooltip>
              <Tooltip content='GitHub'>
                <Footer.Icon
                  href='https://github.com/Dev-ThanhDat'
                  target='_bland'
                  icon={FaGithub}
                />
              </Tooltip>
              <Tooltip content='Portfolio'>
                <Footer.Icon
                  href='https://portfolio.ptd-dev.click/'
                  target='_bland'
                  icon={BsPassportFill}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
