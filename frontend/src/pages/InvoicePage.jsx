import { Box, Button, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectField } from "../helper";
import InvoiceItemTable from "../components/InvoiceItemTable";
import InvoiceDiscountDialog from "../components/InvoiceDiscountDialog";
import ShippingDiscountDialog from "../components/ShippingDiscountDialog";

export default function InvoicePage({token}) {
  const [customer, setCustomer] = useState('');
  const [billingAddr, setBillingAddr] = useState('');
  const [shippingAddr, setShippingAddr] = useState('');
  const [shippingCost, setShippingCost] = useState({});
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Draft');
  const [currency, setCurrency] = useState('$');
  const [wideDiscount, setWideDiscount] = useState({});
  const [subTotal, setSubtotal] = useState(0);
  const [format, setFormat] = useState('PDF');

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

  const statusOptions = [
    {label: 'Draft'},
    {label: 'Sent'},
    {label: 'Paid'},
    {label: 'Cancelled'}
  ];

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
        <Box>
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
          <TextField
            id='billing-address'
            name='billing-address'
            label='Billing Address'
            value={billingAddr}
            variant='outlined'
            autoComplete='on'
            required
            sx={{ width: '100%' }}
            onChange={(e) => setBillingAddr(e.target.value)}
          />
          <TextField
            id='shipping-address'
            name='shipping-address'
            label='Shipping Address'
            value={shippingAddr}
            variant='outlined'
            autoComplete='on'
            required
            sx={{ width: '100%' }}
            onChange={(e) => setShippingAddr(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Issue Date" />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Due Date" />
            </DemoContainer>
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
            id={'status-id'}
            name={'status'}
            label={'Status'}
            value={status}
            options={statusOptions}
            setValue={setStatus}
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
            required
            sx={{ width: '100%' }}
            onChange={(e) => setNotes(e.target.value)}
          />     
          <InvoiceItemTable setSubtotal={setSubtotal} currency={currency}/>
          <InvoiceDiscountDialog setWideDiscount={setWideDiscount}/>
          <ShippingDiscountDialog setShippingCost={setShippingCost}/>
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
          <Button>
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              
            }}
          >
            Download
          </Button>
        </Box>
      </Box>
    </Fragment>
  )
}