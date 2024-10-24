import { deleteUser, getUsers } from '@/api/config';
import { Button, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getUsers({});
      if (response.success) {
        setUsers(response.users);
        if (response.users.length < 9) {
          setShowMore(false);
        }
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const skip = users.length;
    try {
      const response = await getUsers({ skip });
      if (response.success) {
        setUsers((prev) => [...prev, ...response.users]);
        if (response.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const reponse = await deleteUser(userIdToDelete);
      if (reponse.success === false) {
        console.log(reponse.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table
            hoverable
            className='shadow-md'
          >
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className='bg-white dark:border-gray-700 dark:bg-gray-800'
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString('vi-VI')}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='object-cover w-10 h-10 bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin === true ? (
                      <span></span>
                    ) : (
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className='font-medium text-red-500 cursor-pointer hover:underline'
                      >
                        Delete
                      </span>
                    )}
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
        <p className='text-center'>You have no users yet!</p>
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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={handleDeleteUser}
              >
                Yes, I&apos;m sure
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

export default DashUsers;
