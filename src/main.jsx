import Dashboard from '@/pages/Dashboard/index.jsx';
import Home from '@/pages/Home/index.jsx';
import SignIn from '@/pages/SignIn/index.jsx';
import SignUp from '@/pages/SignUp/index.jsx';
import { persistor, store } from '@/redux/store.js';
import { StrictMode } from 'react';
import OnlyAdminPrivateRoute from '@/components/OnlyAdminPrivateRoute/index.jsx';
import PrivateRoute from '@/components/PrivateRoute/index.jsx';
import CreatePost from '@/pages/CreatePost/index.jsx';
import PostDetail from '@/pages/PostDetail/index.jsx';
import Search from '@/pages/Search/index.jsx';
import UpdatePost from '@/pages/UpdatePost/index.jsx';
import 'react-circular-progressbar/dist/styles.css';
import { createRoot } from 'react-dom/client';
import 'react-quill/dist/quill.snow.css';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import './index.scss';
import NotFound from '@/pages/NotFound/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />
          }
        ]
      },
      {
        element: <OnlyAdminPrivateRoute />,
        children: [
          {
            path: '/create-post',
            element: <CreatePost />
          },
          {
            path: '/update-post/:postId',
            element: <UpdatePost />
          }
        ]
      },
      {
        path: '/post/:postSlug',
        element: <PostDetail />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
