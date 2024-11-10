import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage/AuthPage.jsx';
import ChatPage from './pages/ChatPage/ChatPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
