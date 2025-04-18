import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoginBtn from './components/LoginBtn';
import LogoutBtn from './components/LogoutBtn';
import DashboardPage from './pages/DashboardPage';
import InvoicePage from './pages/InvoicePage';


export default function Router () {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && (location.pathname.includes('login') || location.pathname.includes('register'))) navigate('/dashboard', {replace: true});
    if (!token && !location.pathname.includes('login') && !location.pathname.includes('register')) navigate('/', {replace: true});
  }, [token, location.pathname])

  // if the user has a token and is on the dashboard or invoice page, then the navbar should display
  //a logout option instead of a login option
  const navbarButton = token && (location.pathname === '/dashboard' || location.pathname.includes('/invoices'))
    ? <LogoutBtn token={token} setToken={setToken} />
    : <LoginBtn />;
  return (
    <>
      {
        (!location.pathname.includes('login') && !location.pathname.includes('register')) ? (
          location.pathname === '/' ? (
            <Navbar loggedIn={false}>{navbarButton}</Navbar>
          ) : (
            <Navbar token={token} loggedIn={true}>{navbarButton}</Navbar>
          )
        ) : null
      }
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='user/login' element={<LoginPage setToken={setToken} type='user'/>}/>
        <Route path='user/register' element={<RegisterPage setToken={setToken}/>}/>
        <Route path='/dashboard' element={<DashboardPage token={token}/>}/>
        <Route path='/:company/invoices/:invoiceId?/create' element={<InvoicePage token={token}/>}/>
      </Routes>
    </>
  )
}