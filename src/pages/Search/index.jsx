import { getPosts } from '@/api/config';
import PostCard from '@/components/PostCard';
import { Button, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = async (params = {}) => {
    setLoading(true);
    const response = await getPosts(params);
    if (response.success === false) {
      setLoading(false);
    } else {
      setPosts(response.posts);
      setLoading(false);
      if (response.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPosts({ searchTerm });
  };

  const handleShowMore = async () => {
    const skip = posts.length;
    const params = {
      searchTerm,
      skip
    };
    const response = await getPosts(params);
    if (response.success) {
      setPosts([...posts, ...response.posts]);
      if (response.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='border-b border-gray-500 p-7 md:border-r md:min-h-screen'>
        <form
          className='flex flex-col gap-8'
          onSubmit={handleSubmit}
        >
          <div className='flex items-center gap-2'>
            <label
              htmlFor='search'
              className='font-semibold whitespace-nowrap'
            >
              Search:
            </label>
            <TextInput
              placeholder='Search...'
              id='search'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            type='submit'
            outline
            gradientDuoTone='purpleToPink'
          >
            Search
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='p-3 mt-5 text-3xl font-semibold border-gray-500 sm:border-b '>
          Posts results:
        </h1>
        <div className='flex flex-col gap-4 p-7'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-center text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && posts && (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                />
              ))}
            </div>
          )}

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-lg text-teal-500 hover:underline p-7'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
