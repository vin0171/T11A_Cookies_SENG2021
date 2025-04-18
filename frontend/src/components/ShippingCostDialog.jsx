import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputAdornment, Typography, Box } from '@mui/material';
import { Fragment, useState } from 'react';
import { clickableTextStyle, removeNumberScrollbarStyle, SelectField } from '../helper';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function ShippingCostDialog({setShippingCostDetails, setBlur}) {
const [open, setOpen] = useState(false);
const handleClickOpen = () => (setOpen(true));
const handleClose = () => (setOpen(false));

const [shippingCost, setShippingCost] = useState('');
const [shippingTax, setShippingTax] = useState('');

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  setShippingCostDetails({
    shippingCost: formData.get('shipping-cost-name'),
    shippingTax: formData.get('shipping-tax-name')
  })
  setBlur(true)
  handleClose();
}

return (
  <Fragment>
    <Typography 
      onClick={handleClickOpen}
      sx= {{...clickableTextStyle}}>
        Add Shipping Cost
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
          Enter Shipping Costs
      </DialogTitle>
      <DialogContent>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <TextField
            id={'shipping-cost'}
            name={'shipping-cost-name'}
            margin='dense'
            variant='standard'
            label='Shipping Cost'
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            onWheel={(e) => e.target.blur()}
            sx={{...removeNumberScrollbarStyle}}
            type='number'
            slotProps={{
              input: {
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              },
              htmlInput : {
                step: .01
              }
            }}
          />
          <TextField
            id={'shipping-tax'}
            name={'shipping-tax-name'}
            margin='dense'
            variant='standard'
            label='Shipping Tax'
            value={shippingTax}
            onChange={(e) => setShippingTax(e.target.value)}
            onWheel={(e) => e.target.blur()}
            sx={{...removeNumberScrollbarStyle}}
            type='number'
            slotProps={{
              input: {
                startAdornment: <InputAdornment position='start'>$</InputAdornment>
              },
              htmlInput : {
                step: .01
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{justifyContent:'space-around'}}>
        <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
        <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
}