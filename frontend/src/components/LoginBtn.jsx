import { useNavigate } from 'react-router-dom';
import NavbarBtnTemplate from './NavbarBtnTemplate';
import { Fragment } from 'react';
import { Box } from '@mui/material';

/**
 * This component formats and sets thes functionality for the login button which
 * appears in the navbar for an unauthorised user.
 */
export default function LoginBtn() {
  const navigate = useNavigate();
  const handleUserClick = () => {
    navigate('/user/login');
  }

  return (
    <Box sx={{display: 'flex', gap: '20px'}}>
      <NavbarBtnTemplate onClick={handleUserClick} title={'Login'}></NavbarBtnTemplate>
    </Box>
  )
}