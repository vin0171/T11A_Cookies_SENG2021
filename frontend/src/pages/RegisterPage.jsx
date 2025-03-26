import { API_URL } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { loginRegisterFormStyle } from '../helper';
import axios from 'axios';
import AuthPageTemplate from '../components/AuthPageTemplate';
import ErrorMessage from '../components/ErrorMessage';

const Form = loginRegisterFormStyle;

// Format the form to register.
const RegisterForm = ({
  email,
  setEmail,
  name,
  setName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  error
}) => (
  <Form onSubmit={handleSubmit}>
    <TextField 
      id='register-email' 
      name='register-email'
      label='Email' 
      value={email}
      variant='outlined' 
      type='email' 
      autoComplete='on'
      required
      sx={{ width: '100%' }}
      onChange={(e) => setEmail(e.target.value)}
    />
    <TextField
      id='register-name'
      name='register-name'
      label='Name'
      value={name}
      required
      sx={{ width: '100%' }}
      onChange={(e) => setName(e.target.value)}
    />
    <TextField
      id='register-password'
      name='register-password'
      label='Password'
      type='password'
      value={password}
      autoComplete='current-password'
      required
      sx={{ width: '100%' }}
      onChange={(e) => setPassword(e.target.value)}
    />
    <TextField
      id='register-confirm-password'
      name='register-confirm-password'
      label='Confirm Password'
      type='password'
      value={confirmPassword}
      required
      sx={{ width: '100%' }}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    {error.isError && <ErrorMessage error={error.msg} styles={{fontSize: '1.4em'}}></ErrorMessage>}
    <Button 
      type='submit'
      sx={{
        bgcolor: '#6f4e7d',
        height: 55,
        width: 200,
        color: 'white',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1.25em',
        borderRadius: 2,
      }}>
      Register
    </Button>
  </Form>
);

/**
 * This page sets up the register page.
 */
export default function RegisterPage({setToken}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({isError: false, msg: ''});

  useEffect(() => {
    if (password !== confirmPassword) {
      setError({isError: true, msg: 'Passwords do not match'});
    } else {
      setError({isError: false, msg: ''});
    }
  }, [password, confirmPassword]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) return;

    const postParams = {
      email: email,
      password: password,
      name: name
    };

    axios.post(`${API_URL}/admin/auth/register`, postParams)
      .then((response) => {
        setError({isError: false, msg: ''});
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
      
        const defaultStore = {
          store: {
            presentations: []
          }
        }
        return axios.put(`${API_URL}/store`, defaultStore, {headers: {Authorization: `Bearer ${response.data.token}`}})
      })
      .then(() => {navigate('/dashboard', {replace: true})})
      .catch((error) => {
        setError({isError: true, msg: error.response.data.error});
      });
  };

  return (
    <AuthPageTemplate
      authType={'Register'} 
      styles={{ justifyContent: 'space-around', boxHeight: '100%', titleHeight: 'unset', gap: '35px' }}
    >
      <RegisterForm 
        email={email}
        setEmail={setEmail}
        name={name}
        setName={setName}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSubmit={handleSubmit}
        error={error}
      />
    </AuthPageTemplate>
  );
}
