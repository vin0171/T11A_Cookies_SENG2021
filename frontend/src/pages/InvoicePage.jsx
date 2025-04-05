import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectField } from "../helper";
import InvoiceItemTable from "../components/InvoiceItemTable";
import InvoiceDiscountDialog from "../components/InvoiceDiscountDialog";
import ShippingDiscountDialog from "../components/ShippingDiscountDialog";
import axios from "axios";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import TaxDialog from "../components/TaxDialog";
import AddressFields from "../components/AddressFields";

export default function InvoicePage({token}) {
  const [customer, setCustomer] = useState('');
  const [billingAddress1, setBillingAddress1] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingSuburb, setBillingSuburb] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPostCode, setBillingPostCode] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [shippingSuburb, setShippingSuburb] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPostCode, setShippingPostCode] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [bankNum, setBankNum] = useState('');
  const [bankName, setBankName] = useState('');
  const [shippingChecked, setShippingChecked] = useState(false);
  const [shippingCost, setShippingCost] = useState({});
  const [issueDate, setIssueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('$');
  const [wideDiscount, setWideDiscount] = useState({});
  const [tax, setTax] = useState({});
  const [subTotal, setSubtotal] = useState(0);
  const [format, setFormat] = useState('PDF');

  const navigate = useNavigate();

  const calculateTotal = () => {
    let total = 0
    if (Object.keys(shippingCost).length !== 0) {
      total += (parseFloat(shippingCost.shippingCost) + parseFloat(shippingCost.shippingTax))
    }
    if (Object.keys(wideDiscount).length !== 0) {
      if (wideDiscount.discountType === 'Flat') {
        total -= parseFloat(wideDiscount.discountAmount)
      } else {
        total *= (1 - parseFloat(wideDiscount.discountAmount) / 100)
      }
    }
    return total + subTotal
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const button = event.nativeEvent.submitter.name
    console.log(button)
    const postParams = {
      
    }

    if (button === 'save') {
      axios.post(`${API_URL}/v1/invoice`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => navigate('/dashboard'))
      .catch(error => console.log(error.response.data.error))
    }  
  }

  const currencyOptions = [
    {label: '$'},
    {label: '€'},
    {label: '¥'}
  ];
  
  const formatOptions = [
    {label: 'XML'},
    {label: 'PDF'}
  ]
  return (
    <Fragment>
      <Box>
        <Typography>New Invoice</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id='customer-name'
            name='customer-name'
            label='Customer'
            value={customer}
            variant='outlined'
            autoComplete='on'
            required
            sx={{ width: '100%' }}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <Box>
            <Typography>Billing Address</Typography>
            <AddressFields
              type="billing"
              addressLine1={billingAddress1}
              setAddressLine1={setBillingAddress1}
              addressLine2={billingAddress2}
              setAddressLine2={setBillingAddress2}
              suburb={billingSuburb}
              setSuburb={setBillingSuburb}
              state={billingState}
              setState={setBillingState}
              postCode={billingPostCode}
              setPostCode={setBillingPostCode}
              country={billingCountry}
              setCountry={setBillingCountry}
            />
          </Box>
          <Box>
            <Typography>
              Shipping Address
            </Typography>
            <Box>
              <Typography>Same as Billing Address</Typography>
              <Checkbox
                checked={shippingChecked}
                onChange={(event) => {
                  setShippingChecked(event.target.checked)
                }}
                slotProps={{
                  input: {'aria-label': 'controlled'}
                }}
              />
              {
                !shippingChecked && 
                <AddressFields
                  type="shipping"
                  addressLine1={shippingAddress1}
                  setAddressLine1={setShippingAddress1}
                  addressLine2={shippingAddress2}
                  setAddressLine2={setShippingAddress2}
                  suburb={shippingSuburb}
                  setSuburb={setShippingSuburb}
                  state={shippingState}
                  setState={setShippingState}
                  postCode={shippingPostCode}
                  setPostCode={setShippingPostCode}
                  country={shippingCountry}
                  setCountry={setShippingCountry}
                />
              }
            </Box>
          </Box>
          <TextField
            id='bank-name'
            name='bank-name'
            label='Bank Name'
            value={bankName}
            variant='outlined'
            autoComplete='on'
            required
            sx={{ width: '100%' }}
            onChange={(e) => setBankName(e.target.value)}
          />
          <TextField
            id='bank-number'
            name='bank-number'
            label='Bank Account Number'
            type='number'
            value={bankNum}
            variant='outlined'
            autoComplete='on'
            required
            sx={{ width: '100%' }}
            onChange={(e) => setBankNum(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="Issue Date" 
              value={issueDate}
              onChange={(newValue) => setIssueDate(newValue)}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label="Due Date"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
            />
          </LocalizationProvider>
          <TextField
            required
            fullWidth
            margin='dense'
            id='invoice-num'
            name='invoice-num'
            label='Invoice Number'
            type='number'
            variant='standard'
            autoComplete='off'
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
          <SelectField
            id={'currency-id'}
            name={'currency'}
            label={'Currency'}
            value={currency}
            options={currencyOptions}
            setValue={setCurrency}
          />     
          <TextField
            id='notes'
            name='notes'
            label='Notes'
            multiline
            maxRows={4}
            value={notes}
            variant='outlined'
            autoComplete='on'
            sx={{ width: '100%' }}
            onChange={(e) => setNotes(e.target.value)}
          />     
          <InvoiceItemTable setSubtotal={setSubtotal} currency={currency}/>
          <InvoiceDiscountDialog setWideDiscount={setWideDiscount}/>
          <ShippingDiscountDialog setShippingCost={setShippingCost}/>
          <TaxDialog setTax={setTax}/>
          <Typography>
            subtotal = {calculateTotal()}
          </Typography>
          <Typography>
            total = {calculateTotal()}
          </Typography>
          <SelectField
            id={'format-type'}
            name={'format'}
            label={'Format'}
            value={format}
            options={formatOptions}
            setValue={setFormat}
          />
          <Button
            // SUBMIT THE FORM BUT SAVE AS A DRAFT
            type='submit'
            name='save'
          >
            Save
          </Button>
          <Button
            type='submit'
            name='download'
          // SUBMIT THE FORM BUT DOWNLOAD IT 
          >
            Download
          </Button>
        </form>
      </Box>
    </Fragment>
  )
}