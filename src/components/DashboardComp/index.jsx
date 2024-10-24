import { getComments, getPosts, getUsers } from '@/api/config';
import { Button, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup
} from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DashboardComp = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers({ limit: 5 });
        if (response.success) {
          setUsers(response.users);
          setTotalUsers(response.totalUsers);
          setLastMonthUsers(response.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await getPosts({ limit: 5 });
        if (response.success) {
          setPosts(response.posts);
          setTotalPosts(response.totalPosts);
          setLastMonthPosts(response.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await getComments({ limit: 5 });
        if (response.success) {
          setComments(response.comments);
          setTotalComments(response.totalComments);
          setLastMonthComments(response.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex flex-wrap justify-center gap-4'>
        <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 uppercase text-md'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='p-3 text-5xl text-white bg-teal-600 rounded-full shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 uppercase text-md'>
                Total Comments
              </h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='p-3 text-5xl text-white bg-indigo-600 rounded-full shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 uppercase text-md'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap justify-center gap-4 py-3 mx-auto'>
        <div className='flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent users</h1>
            <Button
              outline
              gradientDuoTone='greenToBlue'
            >
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body
                  key={user._id}
                  className='divide-y'
                >
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 bg-gray-500 rounded-full'
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent comments</h1>
            <Button
              outline
              gradientDuoTone='greenToBlue'
            >
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body
                  key={comment._id}
                  className='divide-y'
                >
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-96'>
                      <p className='line-clamp-2'>{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent posts</h1>
            <Button
              outline
              gradientDuoTone='greenToBlue'
            >
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body
                  key={post._id}
                  className='divide-y'
                >
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt='user'
                        className='h-10 bg-gray-500 rounded-md w-14'
                      />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{post.title}</Table.Cell>
                    <Table.Cell className='w-5 capitalize'>
                      {post.category}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComp;
