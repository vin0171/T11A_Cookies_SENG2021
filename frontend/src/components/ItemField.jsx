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
import axios from "axios";
import { API_URL } from "../App";

const itemTypeOptions = [
  {label: 'Add New Item'},
  {label: 'Add Existing Item'}
]

export default function ItemField({
  itemType, 
  setItemType, 
  setBlur, 
  setInvoiceItems, 
  invoiceItems,
  setAddedItems,
  addedItems,
  discountType,
  setDiscountType,
  discountAmount,
  setDiscountAmount,
  companyId, 
  token
}) {
  const [open, setOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [moreDetails, setMoreDetails] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const handleClickOpen = () => (setOpen(true));
  const handleClose = () => (setOpen(false));

  const existingItems =  Object.values(invoiceItems).map((i) => ({
    label: i.name,
  }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setButtonClicked(false);
    console.log(name,sku,price,description,qty)
    const itemDetails = {
      name: name,
      sku: sku,
      price: price,
      description: description,
      companyId: companyId
    };

    const addedDetails = {
      name: name,
      sku: sku,
      price: price,
      description: description,
      qty: qty
    }

    axios.post(`${API_URL}/v3/item`, itemDetails, {headers: {Authorization: `Bearer ${token}`}})
    .then(() => {
      axios.get(`${API_URL}/v3/company/${companyId}/items`, {headers: {Authorization: `Bearer ${token}`}})
      .then((res) => {
        setInvoiceItems(res.data);
        setAddedItems(prev => [...prev, addedDetails]);
        setItemType('Add Existing Item');
        setBlur(true);
      }).catch(error => console.log(error.response.data.error))
    }).catch(error => console.log(error.response.data.error))
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
  console.log(addedItems, invoiceItems);
  return (
    <Fragment> 
      {!(addedItems.length === 0) &&
      <Box sx={{mb: 2}}>
        {addedItems.map((item) => (
          <Box key={item.name} sx={{display: 'flex', alignItems: 'center', gap: 3}}>
            <Typography>{item.name} × {item.qty}</Typography>
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
          options={existingItems}
          onChange={(event, newValue) => {
            setButtonClicked(false); 
            console.log(invoiceItems)
            const existingItem = invoiceItems.find((i) => i.name === newValue.label);
            console.log(existingItem);
            const existingItemDetails = {
              name: existingItem.name,
              sku: existingItem.sku,
              price: existingItem.unitPrice,
              description: existingItem.description,
              qty: 1
            };
            setAddedItems(prev => [...prev, existingItemDetails]);
            setBlur(true);
          }}
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
                id="new-item-name-id"
                name="new-item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="dense"
                variant="standard"
                label="Item"
                required
              />
              <TextField
                id="new-item-qty-id"
                name="new-item-qty"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                margin="dense"
                variant="standard"
                label="Quantity"
                type="number"
                required
                sx={{ ...removeNumberScrollbarStyle }}
                onWheel={(e) => e.target.blur()}
              />
              <TextField
                id="new-item-cost-id"
                name="new-item-cost"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                margin="dense"
                variant="standard"
                label="Price"
                type="number"
                required
                sx={{ ...removeNumberScrollbarStyle }}
                onWheel={(e) => e.target.blur()}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                  htmlInput: {
                    step: 0.01,
                  },
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
                    id="item-sku-id"
                    name="item-sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    label="Item Sku"
                    variant="standard"
                    type="number"
                    sx={{ ...removeNumberScrollbarStyle }}
                    onWheel={(e) => e.target.blur()}
                  />
                  <TextField
                    id="description-id"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    label="Description"
                    variant="standard"
                    sx={{ mb: 2 }}
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
            <Button onClick={handleSubmit} sx={{fontSize: '1em',color:'#27548A'}}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
      }
    </Fragment>
  )
}