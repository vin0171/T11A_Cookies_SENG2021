import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { Fragment, useState } from 'react';
import { API_URL } from '../App';
import { SelectField } from '../helper';

/**
 * This component sets up the dialog that pops up when the user clicks on the create
 * company button on the dashboard.
 */
export default function ValidateInvoiceDialog({token, companyId}) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));
  const [ruleSet, setRuleSet] = useState('PINT A-NZ Billing BIS');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const invoice = formData.get('ubl-invoice');
    axios.post(`${API_URL}/v1/invoice/validate`, {ublInvoice: invoice})
    .then((res) => {
      if (!res.data) {
        console.log('error')
      } else {
        console.log('success')
      }
      handleClose()
    })
    .catch(error => console.log(error))
  }

  const ruleOptions = [
    {
      label: 'PINT A-NZ Billing BIS'
    }
  ]

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
      Validate
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
              height: 275,
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
          <SelectField
            id={'rule-set'}
            name={'rule-set-name'}
            label={'Select Rule Set'}
            value={ruleSet}
            options={ruleOptions}
            setValue={setRuleSet}        
          />
          <TextField
            required
            fullWidth
            margin='dense'
            id='ubl-invoice'
            name='ubl-invoice'
            label='Input UBL Invoice'
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