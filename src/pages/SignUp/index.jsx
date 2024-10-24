import { postSignup } from '@/api/config';
import OAuth from '@/components/OAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserAstronaut } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { MdOutlinePassword } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object({
  username: yup
    .string()
    .required('Please! Enter your username!')
    .min(7, 'Please! Minimum 7 characters!')
    .max(30, 'Please! Maximum 30 characters!'),
  email: yup
    .string()
    .email('Please! Enter your email!')
    .required('Please! Enter your email!'),
  password: yup
    .string()
    .required('Please! Enter your password!')
    .min(8, 'Your password must be at least 8 characters or greater!')
});

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (values) => {
    const { username, email, password } = values;
    const usernameLowerCase = username.toLowerCase().split(' ').join('');
    try {
      const response = await postSignup(usernameLowerCase, email, password);
      if (response.success === false) {
        return setErrorMessage(response.message);
      } else {
        navigate('/sign-in');
        reset({
          username: '',
          email: '',
          password: ''
        });
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='min-h-[calc(100vh-65px-115px)] flex items-center justify-center'>
      <div className='flex flex-col max-w-3xl gap-6 p-3 mx-auto md:flex-row md:items-center'>
        <div className='flex-1 '>
          <Link
            to='/'
            className='max-w-[250px] w-full inline-block'
          >
            <img
              src='/logo.png'
              alt=''
              className='object-cover w-full h-full'
            />
          </Link>
          <p className='mt-5 text-sm'>
            This is a blog project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <h2 className='mb-5 text-4xl font-bold text-center'>SignUp.</h2>
          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
            autoComplete='off'
          >
            <div>
              <Label
                value='Your username:'
                htmlFor='username'
                className='cursor-pointer'
              />
              <TextInput
                type='text'
                placeholder='Username'
                id='username'
                icon={FaUserAstronaut}
                {...register('username')}
              />
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.username?.message}
              </p>
            </div>
            <div>
              <Label
                value='Your email:'
                htmlFor='email'
                className='cursor-pointer'
              />
              <TextInput
                type='email'
                placeholder='abc@email.com'
                id='email'
                icon={HiMail}
                {...register('email')}
              />
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.email?.message}
              </p>
            </div>
            <div>
              <Label
                value='Your password:'
                htmlFor='password'
                className='cursor-pointer'
              />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                icon={MdOutlinePassword}
                {...register('password')}
              />
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.password?.message}
              </p>
            </div>
            <Button
              gradientDuoTone='greenToBlue'
              type='submit'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Have an account?</span>
            <Link
              to='/sign-in'
              className='font-semibold text-blue-500 hover:opacity-75'
            >
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert
              className='mt-5'
              color='failure'
            >
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
