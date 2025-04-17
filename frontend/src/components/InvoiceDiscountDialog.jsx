import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputAdornment } from '@mui/material';
import { Fragment, useState } from 'react';
import { SelectField } from '../helper';
import InvoiceDiscountField from './InvoiceDiscountField';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function InvoiceDiscountDialog({setWideDiscount}) {
const [open, setOpen] = useState(false);
const handleClickOpen = () => (setOpen(true));
const handleClose = () => (setOpen(false));

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  setWideDiscount({
    discountType: formData.get('wide-discount-type-name'),
    discountAmount: formData.get('wide-discount-amount-name')
  })
  
  handleClose();
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
        fontSize: '1.25em',
        fontWeight: 'bold',
        bgcolor: '#41444d'
      }}>
        Add Discount
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
          Enter Invoice-Wide Discount
      </DialogTitle>
      <DialogContent>
        <InvoiceDiscountField type={'wide'}/>
      </DialogContent>
      <DialogActions sx={{justifyContent:'space-around'}}>
        <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
        <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
}