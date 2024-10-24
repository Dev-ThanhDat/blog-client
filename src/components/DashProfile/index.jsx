import { deleteUser, postSignout, putUpdateUser } from '@/api/config';
import { app } from '@/api/firebase-config';
import {
  deleteSuccess,
  signoutSuccess,
  updateSuccess
} from '@/redux/user/userSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useForm } from 'react-hook-form';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object({
  username: yup
    .string()
    .required('Please! Username cannot be blank!')
    .min(7, 'Please! Minimum 7 characters!')
    .max(30, 'Please! Maximum 30 characters!')
});

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [deleteUserError, setDeleteUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageFileUrl);
    };
  }, [imageFileUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)!'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setValue('profilePicture', downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  const onSubmit = async (values) => {
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      const response = await putUpdateUser(currentUser._id, values);
      if (response.success === false) {
        setUpdateUserError(response.message);
      } else {
        dispatch(updateSuccess(response.user));
        setUpdateUserSuccess("User's profile updated successfully!");
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const response = await deleteUser(currentUser._id);
      if (response.success === false) {
        setDeleteUserError(response.message);
      } else {
        dispatch(deleteSuccess());
      }
    } catch (error) {
      setDeleteUserError(error.message);
    }
  };

  // SignOut user
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
    <div className='w-full max-w-lg p-3 mx-auto '>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
        className='flex flex-col gap-4'
      >
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className='relative self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer'
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(87, 27, 226, ${imageFileUploadProgress / 100})`
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]  ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color='failure'>{imageFileUploadError}</Alert>
        )}
        <div>
          <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            {...register('username')}
          />{' '}
          <p className='text-[10px] text-red-500 mt-[2px]'>
            {errors.username?.message}
          </p>
        </div>
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner
                size='sm'
                color='purple'
              />
              <span className='pl-3'>Loading...</span>
            </>
          ) : (
            'Update'
          )}
        </Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='pinkToOrange'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className='flex justify-between mt-5 text-red-500'>
        <span
          onClick={() => setShowModal(true)}
          className='cursor-pointer'
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className='cursor-pointer'
        >
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert
          color='success'
          className='mt-5'
        >
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert
          color='failure'
          className='mt-5'
        >
          {updateUserError}
        </Alert>
      )}
      {deleteUserError && (
        <Alert
          color='failure'
          className='mt-5'
        >
          {deleteUserError}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={handleDeleteUser}
              >
                Yes, I&lsquo;m sure
              </Button>
              <Button
                color='gray'
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
