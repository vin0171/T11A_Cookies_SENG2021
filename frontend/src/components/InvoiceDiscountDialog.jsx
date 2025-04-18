import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputAdornment, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { clickableTextStyle } from '../helper';
import InvoiceDiscountField from './InvoiceDiscountField';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function InvoiceDiscountDialog({
  setWideDiscount,
  discountType,
  setDiscountType,
  discountAmount,
  setDiscountAmount
}) {
const [open, setOpen] = useState(false);
const handleClickOpen = () => (setOpen(true));
const handleClose = () => (setOpen(false));

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  setWideDiscount({
    discountType: formData.get('wide-discount-type'),
    discountAmount: formData.get('wide-discount-amount')
  })  
  handleClose();
}

return (
  <Fragment>
    <Typography
      onClick={handleClickOpen}
      sx= {{...clickableTextStyle}}>
        Add Discount
    </Typography>
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
          Enter Invoice-Wide Discount
      </DialogTitle>
      <DialogContent>
        <InvoiceDiscountField 
          type={'wide'}
          discountType={discountType}
          setDiscountType={setDiscountType}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
        />
      </DialogContent>
      <DialogActions sx={{justifyContent:'space-around'}}>
        <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
        <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
}