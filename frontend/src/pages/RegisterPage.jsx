import { API_URL } from '../App';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { loginRegisterFormStyle } from '../helper';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import axios from 'axios';
import AuthPageTemplate from '../components/AuthPageTemplate';
import ErrorMessage from '../components/ErrorMessage';

const Form = loginRegisterFormStyle;

// Format the form to register.
const RegisterForm = ({
  email,
  setEmail,
  firstName,
  lastName,
  setFirstName,
  setLastName,
  age,
  setAge,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  error,
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
      id='first-name'
      name='first-name'
      label='First Name'
      value={firstName}
      required
      sx={{ width: '100%' }}
      onChange={(e) => setFirstName(e.target.value)}
    />
    <TextField
      id='last-name'
      name='last-name'
      label='Last Name'
      value={lastName}
      required
      sx={{ width: '100%' }}
      onChange={(e) => setLastName(e.target.value)}
    />
    <Box sx={{width: '100%'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateField']}>
          <DateField
            id='age'
            name='age'
            label='Age'
            required
            fullWidth
            sx = {{
              width: '100%',
            }}
            value={age}
            onChange={(age) => setAge(age)}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <Box>
      <TextField
        id='register-password'
        name='register-password'
        label='Password'
        type='password'
        value={password}
        autoComplete='current-password'
        helperText='Password must be at least 8 characters, with both uppercase and lowercase letters.'
        required
        sx={{ 
          width: '100%',
          '& .MuiFormHelperText-root': {
            margin: 0,
            mt: 1,
            mb: 1,
            fontSize: '0.85em'
          }
        }}
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
    </Box>
    {error.isError && <ErrorMessage error={error.msg} styles={{ textAlign: 'center', fontSize: '1.4em' }} />}
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
      Register
    </Button>
  </Form>
);

/**
 * This page sets up the register page.
 */
export default function RegisterPage({ setToken }) {
  console.log('hello?')
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState({ isError: false, msg: '' });
  const [pageScale, setPageScale] = useState('scale(0.85)')

  useEffect(() => {
    if (password === confirmPassword) {
      setError({ isError: false, msg: '' });
    } 
  }, [password, confirmPassword]);

  useEffect(() => {
    if (error.isError) {
      setPageScale('scale(0.77)')
    } else {
      setPageScale('scale(0.85)')
    }
  }, [error]);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError({ isError: true, msg: 'Passwords do not match' });
      return;
    } 

    const postParams = {
      email: email,
      password: password,
      nameFirst: firstName,
      nameLast: lastName,
      age: age
    };  

    axios.post(`${API_URL}/v1/user/register`, postParams)
      .then((response) => {
        console.log(response)
        setError({ isError: false, msg: '' });
        setToken(response.data);
        localStorage.setItem('token', response.data);
      })
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        setError({ isError: true, msg: error.response.data.error });
      });
  };

  return (
    <AuthPageTemplate
      authType={'Register'}
      styles={{ justifyContent: 'space-around', boxHeight: '100%', titleHeight: 'unset', gap: '35px' }}
      backgroundStyles={{ justifyContent: 'center' }}
      formBackgroundStyles={{transform: pageScale}}
    >
      <RegisterForm
        email={email}
        setEmail={setEmail}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        age={age}
        setAge={setAge}
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
