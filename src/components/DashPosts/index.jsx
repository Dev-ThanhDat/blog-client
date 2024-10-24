import { deletePost, getPosts } from '@/api/config';
import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async (userId) => {
      const response = await getPosts({ userId });
      if (response.success) {
        setUserPosts(response.posts);
        if (response.posts.length < 9) {
          setShowMore(false);
        }
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts(currentUser._id);
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const skip = userPosts.length;
    try {
      const response = await getPosts({ userId: currentUser._id, skip });
      if (response.success) {
        setUserPosts((prev) => [...prev, ...response.posts]);
        if (response.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const reponse = await deletePost(postIdToDelete, currentUser._id);
      if (reponse.success === false) {
        console.log(reponse.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table
            hoverable
            className='shadow-md'
          >
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString('vi-VI')}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='object-cover w-20 h-10 bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white line-clamp-1'
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className='capitalize'>
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className='font-medium text-red-500 cursor-pointer hover:underline'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='self-center w-full text-sm text-teal-500 py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no posts yet!</p>
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
              Are you sure you want to delete this post?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={handleDeletePost}
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

export default DashPosts;
