import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { Fragment, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { API_URL } from '../App';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function RegisterCompanyDialog({token, setCompanyCreated}) {
const [open, setOpen] = useState(false);
const handleClickOpen = () => (setOpen(true));
const handleClose = () => (setOpen(false));

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const postParams = {
    companyName: formData.get('companyName'),
    companyAbn: formData.get('companyAbn'),
    companyEmail: formData.get('companyEmail'),
    contactNumber: formData.get('contactNumber'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    postcode: formData.get('postcode'),
    country: formData.get('country'),
  };

  axios.post(`${API_URL}/v1/company/register`, postParams, {headers: {Authorization: `Bearer ${token}`}})
  .then(() => {
    setCompanyCreated(true);
    handleClose();
  }).catch(error => console.log(error.response.data.error));
}

return (
  <Fragment>
    <Button 
      variant='contained' 
      onClick={handleClickOpen}
      sx= {{
        textTransform: 'none',
        height: 50,
        width: 200,
        fontSize: '1.5em',
        fontWeight: 'bold',
        bgcolor: '#41444d'
      }}>
    Register Now
    </Button>
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: 550,
            height: 335,
          },
        },
      }}
    >
      <DialogTitle 
        sx={{
          fontSize: '1.5em', 
          color: '#41444d',
        }}>
          Enter Company Details
      </DialogTitle>
      <DialogContent
        sx ={{
          '&::-webkit-scrollbar': {
            width: '0.4em'
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
          }
        }}
      >
        <TextField
          required
          fullWidth
          margin='dense'
          id='companyName'
          name='companyName'
          label='Company Name'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='companyEmail'
          name='companyEmail'
          label='Company Email'
          variant='standard'
          type='email'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='companyAbn'
          name='companyAbn'
          label='Company ABN'
          type='number'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='contactNumber'
          name='contactNumber'
          label='Contact Number'
          type='number'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='address'
          name='address'
          label='Address'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='city'
          name='city'
          label='City'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='state'
          name='state'
          label='State'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='country'
          name='country'
          label='Country'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
          }}
        />
        <TextField
          required
          fullWidth
          margin='dense'
          id='postcode'
          name='postcode'
          label='Postcode'
          type='number'
          variant='standard'
          autoComplete='off'
          sx={{
            '& label.Mui-focused': { color: '#41444d' },
            '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{justifyContent:'space-around'}}>
        <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
        <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Register</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
}