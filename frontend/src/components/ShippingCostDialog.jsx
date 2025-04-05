import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputAdornment } from '@mui/material';
import { Fragment, useState } from 'react';
import { SelectField } from '../helper';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function ShippingCostDialog({setShippingCostDetails}) {
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
        fontSize: '1em',
        fontWeight: 'bold',
        bgcolor: '#41444d'
      }}>
        Add Shipping Cost
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
          Enter Shipping Costs
      </DialogTitle>
      <DialogContent>
        <TextField
          id={'shipping-cost'}
          name={'shipping-cost-name'}
          margin='dense'
          variant='standard'
          label='Shipping Cost'
          value={shippingCost}
          onChange={(e) => setShippingCost(e.target.value)}
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
      </DialogContent>
      <DialogActions sx={{justifyContent:'space-around'}}>
        <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
        <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
      </DialogActions>
    </Dialog>
  </Fragment>
);
}