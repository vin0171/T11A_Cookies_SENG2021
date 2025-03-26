import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { Fragment, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { API_URL } from '../App';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * presentation button on the dashboard.
 */
export default function CreatePresentationDialog({token, setPresentationCreated}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('presentation-title');
    const id = uuid();

    axios.get(`${API_URL}/store`, {headers: {Authorization: `Bearer ${token}`}})
      .then((response) => {
        const currentPresentations = response.data.store.presentations;
        const newPresentation = {
          id: id,
          title: name,
          thumbnail: null,
          description: '',
          theme: {},
          slides:[{'theme' : {}, 'content': []}],
        }
        currentPresentations.push(newPresentation);
        const store = {
          store: {
            presentations: currentPresentations
          }
        }
        return axios.put(`${API_URL}/store`, store, {headers: {Authorization: `Bearer ${token}`}})
      })
      .then(() => {
        setPresentationCreated(true);
        handleClose();
      })
      .catch(error => console.log(error));
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
      Create Now
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
            Enter Presentation Title
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            fullWidth
            margin='dense'
            id='presentation-title'
            name='presentation-title'
            label='Presentation Title'
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
          <Button type='submit' sx={{fontSize: '1em',color:'#6f4e7d'}}>Create</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}