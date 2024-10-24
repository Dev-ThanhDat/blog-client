import { postSignin } from '@/api/config';
import OAuth from '@/components/OAuth';
import { signinSuccess } from '@/redux/user/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiMail } from 'react-icons/hi';
import { MdOutlinePassword } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .email('Please! Enter your email!')
    .required('Please! Enter your email!'),
  password: yup.string().required('Please! Enter your password!')
});

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    const { email, password } = values;
    try {
      const response = await postSignin(email, password);
      if (response.success === false) {
        return setErrorMessage(response.message);
      } else {
        dispatch(signinSuccess(response.user));
        navigate('/');
        reset({
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
          <h2 className='mb-5 text-4xl font-bold text-center'>SignIn.</h2>
          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
            autoComplete='off'
          >
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
                placeholder='**********'
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
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 mt-5 text-sm'>
            <span>Don&lsquo;t Have an account?</span>
            <Link
              to='/sign-up'
              className='font-semibold text-blue-500 hover:opacity-75'
            >
              Sign Up
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

export default SignIn;
