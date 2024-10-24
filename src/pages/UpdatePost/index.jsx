import { getPosts, putUpdatepost } from '@/api/config';
import { app } from '@/api/firebase-config';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { Alert, Button, FileInput, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import { Controller, useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object({
  title: yup.string().required('Please! Title cannot be blank!'),
  content: yup
    .string()
    .required('Please! Content cannot be blank!')
    .test('content-check', 'Please! Content cannot be blank!', (value) => {
      return value !== '<p><br></p>';
    })
});

const UpdatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [updatePostError, setUpdatePostError] = useState(null);
  const [getPostDetail, setGetPostDetail] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const response = await getPosts({ postId });
        if (response.success === false) {
          setUpdatePostError(response.message);
        } else {
          setUpdatePostError(null);
          reset(response.posts[0]);
          setImageFileUrl(response.posts[0].image);
          setGetPostDetail(response.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId, reset]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageFileUrl);
    };
  }, [imageFileUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image!');
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Image upload failed!');
          setImageUploadProgress(null);
          setImageFileUrl(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setValue('image', downloadURL);
            setImageUploadProgress(null);
            setImageUploadError(null);
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed!');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const onSubmit = async (values) => {
    const { title, content, category, image } = values;
    try {
      const response = await putUpdatepost(getPostDetail._id, currentUser._id, {
        title,
        content,
        category: category.toLowerCase(),
        image
      });
      console.log(response);
      if (response.success === false) {
        setUpdatePostError(response.message);
      } else {
        setUpdatePostError(null);
        navigate(`/post/${response.post.slug}`);
      }
    } catch (error) {
      setUpdatePostError(error.message);
    }
  };

  return (
    <div className='max-w-3xl min-h-screen p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a post</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <div className='flex flex-col justify-between gap-4 sm:flex-row'>
          <div className='flex-1'>
            <TextInput
              type='text'
              placeholder='Title...'
              {...register('title')}
            />
            <p className='text-[10px] text-red-500 mt-[2px]'>
              {errors.title?.message}
            </p>
          </div>
          <TextInput
            type='text'
            placeholder='Category...'
            {...register('category')}
          />
        </div>
        <div className='flex items-center justify-between gap-4 p-3 border-4 border-teal-500 border-dotted'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
          <Button
            type='button'
            gradientMonochrome='failure'
            size='sm'
            outline
            onClick={handleUpdloadImage}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                  styles={{
                    path: {
                      stroke: `rgba(241,106,56,1)`
                    }
                  }}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt='upload'
            className='object-cover w-full h-72'
          />
        )}
        <div>
          <Controller
            control={control}
            name='content'
            render={({ field }) => (
              <ReactQuill
                theme='snow'
                className='mb-12 h-72'
                {...field}
              />
            )}
          />
          <p className='text-[10px] text-red-500 mt-[2px]'>
            {errors.content?.message}
          </p>
        </div>
        <Button
          type='submit'
          gradientMonochrome='teal'
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
        {updatePostError && (
          <Alert
            className='mt-5'
            color='failure'
          >
            {updatePostError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
