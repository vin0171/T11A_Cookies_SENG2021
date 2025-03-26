import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoginBtn from './components/LoginBtn';
import LogoutBtn from './components/LogoutBtn';
import DashboardPage from './pages/DashboardPage';


export default function Router () {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && ['/login', '/register'].includes(location.pathname)) navigate('/dashboard', {replace: true});
    if (!token && !['/login', '/register'].includes(location.pathname)) navigate('/', {replace: true});
  }, [token, location.pathname])

  // if the user has a token and is on the dashboard, then the navbar should display
  //a logout option instead of a login option
  const navbarButton = token && (location.pathname === '/dashboard' || location.pathname.includes('/presentation'))
    ? <LogoutBtn token={token} setToken={setToken} />
    : <LoginBtn />;
  return (
    <>
      {(
        location.pathname !== '/login' &&
      location.pathname !== '/register' &&
      !location.pathname.includes('slideshow')
      ) && <Navbar>{navbarButton}</Navbar>}
      <Routes>
        <Route path='/' element={<HomePage token={token}/>}/>
        <Route path='/login' element={<LoginPage setToken={setToken}/>}/>
        <Route path='/register' element={<RegisterPage setToken={setToken}/>}/>
        <Route path='/dashboard' element={<DashboardPage token={token}/>}/>
      </Routes>
    </>
  )
}