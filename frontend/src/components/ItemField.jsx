import { Fragment, useEffect, useState } from "react";
import { SelectField } from "../helper";
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InvoiceDiscountField from "./InvoiceDiscountField";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default function ItemField({itemType, setItemType, setBlur, setInvoiceItems, invoiceItems}) {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [moreDetails, setMoreDetails] = useState(false);
  const [discountType, setDiscountType] = useState('Flat');
  const [discountAmount, setDiscountAmount] = useState('');
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('new-item-name');
    const qty = formData.get('new-item-qty');
    const price = formData.get('new-item-cost');
    const sku = formData.get('item-sku');
    const description = formData.get('description');
    console.log(discountType, discountAmount)
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
      <Box>
        {existingItems.map((item) => (
          <Box key={item.name} sx={{display: 'flex', alignItems: 'center'}}>
            <Typography>{item.name} × {item.quantity}</Typography>
            {/* on click, edit the item (backend)*/}
            <IconButton>
              <EditIcon/>
            </IconButton>
            {/* on click, delete the item (backend)*/}
            <IconButton>
              <DeleteIcon/>
            </IconButton>
          </Box>
        ))}
      </Box>
      }
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
          setBlur={setBlur}
        />
        {itemType === 'Add Existing Item' && 
        <Autocomplete
          disablePortal
          options={dummyExistingItems}
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
              Enter New Item Details
          </DialogTitle>
          <DialogContent dividers>
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
              sx={{
                '& label.Mui-focused': { color: '#41444d' },
                '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }}
            />
            <TextField
              id={'new-item-cost-id'}
              name={'new-item-cost'}
              margin='dense'
              variant='standard'
              label='Price'
              type='number'
              required
              sx={{
                '& label.Mui-focused': { color: '#41444d' },
                '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                },
                htmlInput : {
                  step: .01
                }
              }}
            />
            <Box sx={{display: 'flex'}}>
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
                  color: 'primary.main', 
                },
              }}
            >
              Add Additional Details
              {moreDetails ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </Typography>
            {moreDetails && 
              <Box>
                <TextField
                  id='item-sku-id'
                  name='item-sku'
                  label='Item Sku'
                  variant='outlined'
                  type='number'
                  sx={{
                    '& label.Mui-focused': { color: '#41444d' },
                    '& .MuiInput-underline:after': { borderBottomColor: '#41444d' },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                    '& input[type=number]::-webkit-outer-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '& input[type=number]::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                  }}
                />
                <TextField
                  id='description-id'
                  name='description'
                  label='Description'
                  variant='outlined'
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