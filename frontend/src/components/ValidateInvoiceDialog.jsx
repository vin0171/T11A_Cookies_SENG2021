import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { Fragment, useState } from 'react';
import { API_URL } from '../App';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * presentation button on the dashboard.
 */
export default function ValidateInvoiceDialog({token, companyId}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('user-email');
    axios.post(`${API_URL}/v1/company/userAdd`, {companyId: companyId, userEmailToAdd: email},
      {headers: {Authorization: `Bearer ${token}`}
    }).then(() => handleClose())
    .catch(error => console.log(error.response.data.error))
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
          bgcolor: 'darkseagreen'
        }}>
      Add a User
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
              bgcolor:'#e2dacd',
              width: 550,
              height: 225,
            },
          },
        }}
      >
        <DialogTitle 
          sx={{
            fontSize: '1.5em', 
            color: '#41444d',
          }}>
            Enter UBL Invoice
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            fullWidth
            margin='dense'
            id='user-email'
            name='user-email'
            label='Enter Email'
            type='email'
            variant='standard'
            autoComplete='off'
            sx={{
              '& label.Mui-focused': {
                color: '#41444d'
              },
              '& .MuiInput-underline:after': {
                borderBottomColor: '#41444d'
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{justifyContent:'space-around'}}>
          <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
          <Button type='submit' sx={{fontSize: '1em',color:'#6f4e7d'}}>Add</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}