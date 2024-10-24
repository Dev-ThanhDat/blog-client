import { getUser, putEditComment } from '@/api/config';
import { Button, Textarea } from 'flowbite-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state) => state.user);

  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUser(comment.userId);
        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const response = await putEditComment(comment._id, {
        content: editedContent
      });
      if (response.success) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='flex p-4 text-sm border-b dark:border-gray-600'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 bg-gray-200 rounded-full'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='mr-1 text-xs font-bold truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-xs text-gray-500'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              maxLength='200'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className='flex items-center justify-between gap-2 text-xs'>
              <p className='text-xs text-gray-500'>
                {200 - editedContent.length} characters remaining
              </p>
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='pinkToOrange'
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className='pb-2 text-gray-500'>{comment.content}</p>
            <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
              <button
                type='button'
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      onClick={handleEdit}
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      onClick={() => onDelete(comment._id)}
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
