import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, InputAdornment, Typography, Box } from '@mui/material';
import { Fragment, useState } from 'react';
import { clickableTextStyle, removeNumberScrollbarStyle, SelectField } from '../helper';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function TaxDialog({setTax, setBlur}) {
const [open, setOpen] = useState(false);
const handleClickOpen = () => (setOpen(true));
const handleClose = () => (setOpen(false));

const [taxType, setTaxType] = useState('GST');
const [customTax, setCustomTax] = useState('Flat');
const [taxAmount, setTaxAmount] = useState('');

const taxOptions = [
  {label: 'GST'},
  {label: 'Custom'}
]

const customOptions = [
  {label: 'Flat'},
  {label: 'Percentage'}
]

const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const taxType = formData.get('tax-type-name')
  if (taxType !== 'Custom') {
    setTax({
      taxType: formData.get('tax-type-name'),
    })
  } else {
    setTax({
      taxType: 'Custom',
      taxOption: formData.get('custom-tax-type-name'),
      taxAmount: formData.get('custom-tax-amount-name')
    })
  }
  setBlur(true)
  handleClose();
}

return (
  <Fragment>
    <Typography
      onClick={handleClickOpen}
      sx= {{...clickableTextStyle}}>
        Add Tax
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
          Enter Tax Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <SelectField
            id={'tax-type'}
            name={'tax-type-name'}
            label={'Select Tax Type'}
            value={taxType}
            options={taxOptions}
            setValue={setTaxType}        
          />
          {taxType === 'Custom' && 
            <Fragment>
              <SelectField
                id={'custom-tax-type'}
                name={'custom-tax-type-name'}
                label={'Select Custom Tax Type'}
                value={customTax}
                options={customOptions}
                setValue={setCustomTax}        
              />
              <TextField
                id={'custom-tax-amount'}
                name={'custom-tax-amount-name'}
                margin='dense'
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                onWheel={(e) => e.target.blur()}
                sx={{...removeNumberScrollbarStyle}}
                variant='standard'
                label='Custom Tax Amount'
                type='number'
                slotProps={{
                  input: {
                    ...(customTax === 'Flat')
                      ? { startAdornment: <InputAdornment position='start'>$</InputAdornment>}
                      : {endAdornment: <InputAdornment position='end'>%</InputAdornment>}
                  },
                  htmlInput : {
                    step: .01
                  }
                }}
              />
            </Fragment>
          }
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