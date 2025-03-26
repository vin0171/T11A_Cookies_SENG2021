import { useNavigate } from 'react-router-dom';
import NavbarBtnTemplate from './NavbarBtnTemplate';
import axios from 'axios';
import { API_URL } from '../App';


/**
 * This component formats and sets thes functionality for the logout button which
 * appears in the navbar for an authorised user.
 */
export default function LogoutBtn({token, setToken}) {
  const navigate = useNavigate();
  const handleClick = () => {
    axios.post(`${API_URL}/admin/auth/logout`, {}, {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then(() => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
      }).catch(error=> {console.log(error.response.data.error)})
  }

  return (
    <NavbarBtnTemplate onClick={handleClick} title={'Logout'}></NavbarBtnTemplate>
  )
}