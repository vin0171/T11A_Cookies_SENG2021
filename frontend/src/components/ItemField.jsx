import { Fragment, useEffect, useState } from "react";
import { SelectField } from "../helper";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from "@mui/material";


const itemTypeOptions = [
  {label: 'Add New Item'},
  {label: 'Add Existing Item'}
]


export default function ItemField({itemType, setItemType}) {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false)
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleClose();
  }

  useEffect(() => {
    console.log('open', open)
    if (!open) {
      setItemType('Add Existing Item');
    }
  }, [open])

  useEffect(() => {
    if (buttonClicked && itemType === 'Add New Item') {
      handleClickOpen();
    }
  }, [buttonClicked, itemType])
  
  return (
    <Fragment> 
      <Button onClick={() => setButtonClicked(!buttonClicked)}>
        {buttonClicked ? 'Cancel' : 'Add Item'}
      </Button>
      {buttonClicked && 
      <Fragment>
        <SelectField
          id={'item-type-id'}
          name={'item-type'}
          label={'Add or Find an Item'}
          value={itemType}
          options={itemTypeOptions}
          setValue={setItemType}
        />
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
      }
    </Fragment>
  )
}