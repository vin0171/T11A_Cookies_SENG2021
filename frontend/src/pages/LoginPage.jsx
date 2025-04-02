import { API_URL } from '../App';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { loginRegisterFormStyle } from '../helper';
import axios from 'axios';
import AuthPageTemplate from '../components/AuthPageTemplate';
import ErrorMessage from '../components/ErrorMessage';

const Form = loginRegisterFormStyle;

// Format the form to login.
const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit, error }) => (
  <Form onSubmit={handleSubmit}>
    <TextField
      id='login-email'
      name='login-email'
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
      id='login-password'
      name='login-password'
      label='Password'
      value={password}
      type='password'
      autoComplete='current-password'
      required
      sx={{ width: '100%' }}
      onChange={(e) => setPassword(e.target.value)}
    />
    {error.isError && <ErrorMessage error={error.msg} styles={{ fontSize: '1.4em' }} />}
    <Button
      type='submit'
      sx={{
        bgcolor: '#007BFF', // Blue color
        height: 55,
        width: 200,
        color: 'white',
        textTransform: 'none',
        fontWeight: 'bold',
        fontSize: '1.25em',
        borderRadius: 2,
      }}
    >
      Login
    </Button>
  </Form>
);

/**
 * This page sets up the login page.
 */
export default function LoginPage({ setToken }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ isError: false, msg: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const postParams = {
      email: formData.get('login-email'),
      password: formData.get('login-password'),
    };

    axios
      .post(`${API_URL}/admin/auth/login`, postParams)
      .then((response) => {
        setError({ isError: false, msg: '' });
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        setError({ isError: true, msg: error.response.data.error });
      });
  };

  return (
    <AuthPageTemplate
      authType={'Login'}
      styles={{ justifyContent: 'space-evenly', boxHeight: '75%', titleHeight: '50%', gap: '10px' }}
    >
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        error={error}
      />
    </AuthPageTemplate>
  );
}
