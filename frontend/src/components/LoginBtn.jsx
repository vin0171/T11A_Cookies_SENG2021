import { useNavigate } from 'react-router-dom';
import NavbarBtnTemplate from './NavbarBtnTemplate';

/**
 * This component formats and sets thes functionality for the login button which
 * appears in the navbar for an unauthorised user.
 */
export default function LoginBtn() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/login');
  }

  return (
    <NavbarBtnTemplate onClick={handleClick} title={'Login'}></NavbarBtnTemplate>
  )
}