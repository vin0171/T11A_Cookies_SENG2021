import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Fragment, useState } from 'react';
import { removeNumberScrollbarStyle } from '../helper';

export default function ExistingItemDialog({
  addedItemQty, 
  setAddedItemQty, 
  setBlur, 
  addedItems,
  setAddedItems,
  currentItem
}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));
  
  const handleSubmit = (event) => {
    console.log(addedItems, currentItem);
    event.preventDefault();
    setAddedItemQty(addedItemQty);
    const updatedItems = addedItems.map((i) => 
      i.id === currentItem.id ? { ...i, qty: addedItemQty } : i
  );
    setAddedItems(updatedItems);
    handleClose();
    setBlur(true);
  }

  return (
    <Fragment>
      <IconButton onClick={() => handleClickOpen()}>
      <EditIcon sx={{fontSize: '1.15em'}}/>
      </IconButton>
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
              width: 300,
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
            Enter Quantity
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            fullWidth
            margin='dense'
            id='added-item-qty-id'
            name='added-item-qty'
            type='number'
            variant='standard'
            value={addedItemQty}
            onChange={(e) => setAddedItemQty(e.target.value)}
            sx={{...removeNumberScrollbarStyle}}
          />
        </DialogContent>
        <DialogActions sx={{justifyContent:'space-around'}}>
          <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
          <Button onClick={handleSubmit} sx={{fontSize: '1em',color:'#6f4e7d'}}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}