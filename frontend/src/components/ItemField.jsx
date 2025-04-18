import { Fragment, useEffect, useState } from "react";
import { removeNumberScrollbarStyle, SelectField } from "../helper";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InvoiceDiscountField from "./InvoiceDiscountField";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const itemTypeOptions = [
  {label: 'Add New Item'},
  {label: 'Add Existing Item'}
]

// replace with real data after backend implements allat
const dummyExistingItems = [
  {label: 'test1'},
  {label: 'test2'},
  {label: 'test3'}
]

// replace with real data
const existingItems = [
  {name: 'item1', quantity: '1'},
  {name: 'item2', quantity: '2'},
  {name: 'item3', quantity: '3'}
]

export default function ItemField({
  itemType, 
  setItemType, 
  setBlur, 
  setInvoiceItems, 
  invoiceItems,
  discountType,
  setDiscountType,
  discountAmount,
  setDiscountAmount
}) {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [moreDetails, setMoreDetails] = useState(false);
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const handleSubmit = (event) => {
    event.preventDefault();
    setButtonClicked(false);
    setBlur(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('new-item-name');
    const qty = formData.get('new-item-qty');
    const price = formData.get('new-item-cost');
    const sku = formData.get('item-sku');
    const description = formData.get('description');
    
    
    handleClose();
  }

  useEffect(() => {
    if (!open) {
      setItemType('Add Existing Item');
    }
  }, [open])

  useEffect(() => {
    if (buttonClicked && itemType === 'Add New Item') {
      setMoreDetails(false)
      handleClickOpen();
    }
  }, [buttonClicked, itemType])
  return (
    <Fragment> 
      {!(JSON.stringify(existingItems) === '[{}]') &&
      <Box sx={{mb: 2}}>
        {existingItems.map((item) => (
          <Box key={item.name} sx={{display: 'flex', alignItems: 'center', gap: 3}}>
            <Typography>{item.name} × {item.quantity}</Typography>
            <Box>
              {/* on click, edit the item (backend)*/}
              <IconButton>
                <EditIcon/>
              </IconButton>
              {/* on click, delete the item (backend)*/}
              <IconButton>
                <DeleteIcon/>
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      }
      <Button 
        sx={{width: 'fit-content', bgcolor: 'cornflowerblue', textTransform: 'none', fontSize: '1.15em'}} 
        variant='contained' 
        endIcon={buttonClicked ? <CloseIcon/> : <AddIcon/>}
        onClick={() => setButtonClicked(!buttonClicked)}
      >
        {buttonClicked ? 'Cancel' : 'Add Item'}
      </Button>
      {buttonClicked && 
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', mt: 2}}>
        <SelectField
          id={'item-type-id'}
          name={'item-type'}
          label={'Add or Find an Item'}
          value={itemType}
          options={itemTypeOptions}
          setValue={setItemType}
        />
        {itemType === 'Add Existing Item' && 
        <Autocomplete
          disablePortal
          options={dummyExistingItems}
          onChange={() => {setButtonClicked(false); setBlur(true)}}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label='Find Item' />}
        /> 
        }
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
              Enter New Item Details
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <TextField
                id={'new-item-name-id'}
                name={'new-item-name'}
                margin='dense'
                variant='standard'
                label='Item'
                required
              />
              <TextField
                id={'new-item-qty-id'}
                name={'new-item-qty'}
                margin='dense'
                variant='standard'
                label='Quantity'
                type='number'
                required
                sx={{...removeNumberScrollbarStyle}}
                onWheel={(e) => e.target.blur()}
              />
              <TextField
                id={'new-item-cost-id'}
                name={'new-item-cost'}
                margin='dense'
                variant='standard'
                label='Price'
                type='number'
                required
                sx={{...removeNumberScrollbarStyle}}
                onWheel={(e) => e.target.blur()}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>
                  },
                  htmlInput : {
                    step: .01
                  }
                }}
              />
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography>Save Item</Typography>
                <Checkbox
                  slotProps={{
                    input: {'aria-label': 'controlled'}
                  }}
                />
              </Box>
              <Typography
                onClick={() => setMoreDetails(!moreDetails)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    color: 'cornflowerblue',
                  }
                }}
              >
                Add Additional Details
                {moreDetails ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
              </Typography>
              {moreDetails && 
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <TextField
                    id='item-sku-id'
                    name='item-sku'
                    label='Item Sku'
                    variant='standard'
                    type='number'
                    sx={{...removeNumberScrollbarStyle}}
                    onWheel={(e) => e.target.blur()}
                  />
                  <TextField
                    id='description-id'
                    name='description'
                    label='Description'
                    variant='standard'
                    sx={{mb: 2}}
                  />
                  <InvoiceDiscountField 
                    type={'item'} 
                    discountType={discountType}
                    setDiscountType={setDiscountType}
                    discountAmount={discountAmount}
                    setDiscountAmount={setDiscountAmount}
                  />
                </Box>
              }
            </Box>
          </DialogContent>
          <DialogActions sx={{justifyContent:'space-around'}}>
            <Button onClick={handleClose} sx={{fontSize: '1em', color:'#41444d'}}>Cancel</Button>
            <Button type='submit' sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
      }
    </Fragment>
  )
}