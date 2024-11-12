import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage/AuthPage.jsx';
import ChatPage from './pages/ChatPage/ChatPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import useAppStore from './slices/user.slice.js';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function Authenticate({}) {
  const { userInfo } = useAppStore();
  return !userInfo || userInfo === undefined ? (
    <Navigate to="/auth" />
  ) : !userInfo.firstName || !userInfo.lastName ? (
    <Navigate to="/profile" />
  ) : (
    <Outlet />
  );
}

function AlreadyLoggedIn() {
  const { userInfo } = useAppStore();

  return userInfo !== undefined && userInfo._id ? (
    <Navigate to="/chat" />
  ) : (
    <Outlet />
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*if not logged in or profile is not setup then go to login or profile page respectively*/}
          <Route element={<Authenticate />}>
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />

          {/*if already logged in then redirect to chat page or profile page */}
          <Route element={<AlreadyLoggedIn />}>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
