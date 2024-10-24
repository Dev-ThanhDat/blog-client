import { postGoogle } from '@/api/config';
import { app } from '@/api/firebase-config';
import { signinSuccess } from '@/redux/user/userSlice';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const response = await postGoogle(
        resultsFromGoogle.user.displayName,
        resultsFromGoogle.user.email,
        resultsFromGoogle.user.photoURL
      );
      if (response.success === true) {
        dispatch(signinSuccess(response.user));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type='button'
      gradientDuoTone='pinkToOrange'
      outline
      onClick={handleGoogleClick}
    >
      <div className='flex items-center'>
        <AiFillGoogleCircle className='w-6 h-6 mr-2' />
        <span>Continue with Google</span>
      </div>
    </Button>
  );
};

export default OAuth;
