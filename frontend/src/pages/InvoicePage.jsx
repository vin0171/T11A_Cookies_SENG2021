import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectField } from "../helper";
import InvoiceItemTable from "../components/InvoiceItemTable";
import InvoiceDiscountDialog from "../components/InvoiceDiscountDialog";
import ShippingCostDialog from "../components/ShippingCostDialog";
import axios from "axios";
import { API_URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { saveAs } from 'file-saver';
import TaxDialog from "../components/TaxDialog";
import AddressFields from "../components/AddressFields";
import dayjs from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.addVirtualFileSystem(pdfFonts);

export default function InvoicePage({token}) {
  const navigate = useNavigate();
  const invoiceId =  useParams().invoiceId;
  const [customer, setCustomer] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
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
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [bankNum, setBankNum] = useState('');
  const [bankName, setBankName] = useState('');
  const [shippingChecked, setShippingChecked] = useState(false);
  const [shippingCostDetails, setShippingCostDetails] = useState({});
  const [issueDate, setIssueDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('$');
  const [wideDiscount, setWideDiscount] = useState({});
  const [tax, setTax] = useState({});
  const [subTotal, setSubtotal] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [format, setFormat] = useState('PDF');
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/v1/invoice/${invoiceId}`, {headers: {Authorization: `Bearer ${token}`}})
    .then((res) => {
      setCustomer(res.data.details.receiver.companyName);
      setCustomerEmail(res.data.details.receiver.email);

      setBillingAddress1(res.data.details.receiver.billingAddress.addressLine1);
      setBillingAddress2(res.data.details.receiver.billingAddress.addressLine2);
      setBillingSuburb(res.data.details.receiver.billingAddress.suburb);
      setBillingState(res.data.details.receiver.billingAddress.state);
      setBillingPostCode(res.data.details.receiver.billingAddress.postcode);
      setBillingCountry(res.data.details.receiver.billingAddress.country);

      setShippingAddress1(res.data.details.receiver.shippingAddress.addressLine1);
      setShippingAddress2(res.data.details.receiver.shippingAddress.addressLine2);
      setShippingSuburb(res.data.details.receiver.shippingAddress.suburb);
      setShippingState(res.data.details.receiver.shippingAddress.state);
      setShippingPostCode(res.data.details.receiver.shippingAddress.postcode);
      setShippingCountry(res.data.details.receiver.shippingAddress.country);  
      setShippingChecked(res.data.details.shippingChecked);
      setShippingCostDetails(res.data.details.shippingCostDetails)
      
      setInvoiceNumber(res.data.details.invoiceNumber);
      setBankNum(res.data.details.receiver.bankAccount);
      setBankName(res.data.details.receiver.bankName);
      if (res.data.details.issueDate !== null) setIssueDate(dayjs(res.data.details.issueDate));
      if (res.data.details.dueDate !== null) setDueDate(dayjs(res.data.details.dueDate));
      setNotes(res.data.details.notes);
      setCurrency(res.data.details.currency);
      setWideDiscount(res.data.details.wideDiscount);
      setTax(res.data.details.tax);
      setInvoiceItems(res.data.details.items);
      setFormat(res.data.details.format);
      setSubtotal(res.data.details.subtotal);
    }).catch((error) => {
      if (error.response.data.error === 'Error: Invoice does not exist') setUpdate(false)
    }) 
  }, [])

  const calculateTotal = () => {
    let total = 0
    if (Object.keys(shippingCostDetails).length !== 0) {
      const shippingCost = parseFloat(shippingCostDetails.shippingCost) || 0;
      const shippingTax = parseFloat(shippingCostDetails.shippingTax) || 0;
      total += (shippingCost + shippingTax)
    }

    total += subTotal
    if (Object.keys(wideDiscount).length !== 0) {
      const discountAmount = parseFloat(wideDiscount.discountAmount) || 0;
      if (wideDiscount.discountType === 'Flat') {
        total -= discountAmount
      } else {
        total *= (1 - discountAmount / 100)
      }
    }
    if (Object.keys(tax).length !== 0) {
      const taxAmount = parseFloat(tax.taxAmount) || 0;
      if (tax.taxType === 'GST') {
        total *= (1.1)
      } else if (tax.taxType === 'Custom') {
        if (tax.taxOption === 'Flat') {
          total += taxAmount
        } else {
          total *= (1 + (taxAmount / 100))
        }
      }
    }
    return total
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const button = event.nativeEvent.submitter.name
    const formData = new FormData(event.currentTarget);
    const billingAddress = {
      addressLine1: formData.get('billing-address-line1') || '',
      addressLine2: formData.get('billing-address-line2') || '',
      suburb: formData.get('billing-suburb') || '',
      state: formData.get('billing-state') || '',
      postcode: formData.get('billing-postcode') || '',
      country: formData.get('billing-country') || ''
    }

    const shippingAddress = {
      addressLine1: formData.get('shipping-address-line1') || '',
      addressLine2: formData.get('shipping-address-line2') || '',
      suburb: formData.get('shipping-suburb') || '',
      state: formData.get('shipping-state') || '',
      postcode: formData.get('shipping-postcode') || '',
      country: formData.get('shipping-country') || '',
    }

    const participant = {
      companyName: formData.get('customer-name'),
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      email: formData.get('customer-email'),
      bankName: formData.get('bank-name'),
      bankAccount: formData.get('bank-number'),
    }
    const items = invoiceItems.map((item) => {
      const itemQuantity = parseInt(item.quantity || 0);
      const unitPrice = parseInt(item.unitPrice || 0);
      const discountAmount = parseInt(item.discountAmount || 0);
      const total = itemQuantity * unitPrice
      return {
        id: item.id,
        isNew: false,
        itemSku: item.itemSku,
        itemName: item.itemName,
        description: item.description,
        quantity: itemQuantity,
        unitPrice: unitPrice, 
        discountAmount: discountAmount,
        totalAmount: total * (1 - discountAmount / 100)
      };
    });

    const invoiceDetails = {
      receiver: participant,
      issueDate: issueDate,
      dueDate: dueDate,
      invoiceNumber: formData.get('invoice-num'),
      shippingChecked: shippingChecked,
      status: 'DRAFT',
      state: 'MAIN',
      items: items,
      wideDiscount: wideDiscount,
      tax: tax,
      format: formData.get('format'),
      currency: formData.get('currency'),
      shippingCostDetails: shippingCostDetails,
      subtotal: subTotal,
      total: calculateTotal(),
      notes: formData.get('notes')
    }
    const params = {
      invoiceId: invoiceId,
      ...(update
        ? { edits: invoiceDetails }
        : {isDraft: true, invoiceDetails: invoiceDetails}
      )
    }
    if (button === 'save') {
      const url = update ? `${API_URL}/v1/invoice/${invoiceId}/edit` : `${API_URL}/v2/invoice`
      const method = update ? axios.put : axios.post;
      method(url, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {console.log(res.data); navigate('/dashboard')})
      .catch(error => console.log(error.response.data.error))
    } else if (button === 'download') {
      if (format === 'PDF') {
        axios.post(`${API_URL}/v1/invoice/${invoiceId}/pdf`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((doc) => {
          pdfMake.createPdf(doc.data).download(`invoice-${invoiceNumber}.pdf`);
        })
        .catch(error => console.log(error?.response?.data?.error || error.message));
      } else {
        // download as ubl
        axios.get(`${API_URL}/v1/invoice/${invoiceId}/`, {
          headers: { Authorization: `Bearer ${token}`,  'Accept': 'application/xml' },
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: 'application/xml' });
          saveAs(blob, `invoice-${invoiceNumber}.xml`);
        })
        .catch(error => console.log(error.response.data.error))
      }
    } 
  }

  const currencyOptions = [
    {label: '$'},
    {label: '€'},
    {label: '¥'}
  ];
  
  const formatOptions = [
    {label: 'UBL (PINT A-NZ Billing Profile)'},
    {label: 'PDF'}
  ]
  return (
    <Fragment>
      <Box sx={{p: 10, bgcolor: '#e2dacd'}}>
        <Button> Upload Order Document </Button>
        <Typography>New Invoice</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id='customer-name'
            name='customer-name'
            label='Customer'
            value={customer}
            variant='outlined'
            autoComplete='on'
            sx={{ width: '100%' }}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <TextField
            id='customer-email'
            name='customer-email'
            label='Customer Email'
            value={customerEmail}
            variant='outlined'
            type='email'
            autoComplete='on'
            sx={{ width: '100%' }}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Box>
            <Typography>Billing Address</Typography>
            <AddressFields
              type='billing'
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
                  type='shipping'
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
            sx={{ width: '100%' }}
            onChange={(e) => setBankNum(e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label='Issue Date'
              name='issue-date'
              value={issueDate}
              onChange={(newValue) => setIssueDate(newValue)}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              label='Due Date'
              name='due-date'
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
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
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
          <SelectField
            id={'format-id'}
            name={'format'}
            label={'Format'}
            value={format}
            options={formatOptions}
            setValue={setFormat}
          />     
          <InvoiceItemTable rows={invoiceItems} setRows={setInvoiceItems} setSubtotal={setSubtotal} currency={currency}/>
          <InvoiceDiscountDialog setWideDiscount={setWideDiscount}/>
          <ShippingCostDialog shippingCostDetails={shippingCostDetails} setShippingCostDetails={setShippingCostDetails}/>
          <TaxDialog setTax={setTax}/>
          <Typography>
            subtotal = {currency}{subTotal}
          </Typography>
          {Object.keys(wideDiscount).length !== 0 && 
          (
            <Fragment>
              {wideDiscount.discountType === 'Flat' && wideDiscount.discountAmount !== '' && <Typography>Wide Discount: {currency}{parseFloat(wideDiscount.discountAmount).toFixed(2)}</Typography>}
              {wideDiscount.discountType === 'Percentage' && wideDiscount.discountAmount !== '' && <Typography>Wide Discount: {currency}{subTotal * (parseFloat(wideDiscount.discountAmount) / 100) + '%'}</Typography>}
            </Fragment>
          )}
          <Typography>
          </Typography>
          {Object.keys(shippingCostDetails).length !== 0 && 
            <Fragment>
              {shippingCostDetails.shippingCost !== '' && <Typography>Shipping Cost: {currency}{shippingCostDetails.shippingCost}</Typography>}
              {shippingCostDetails.shippingTax !== '' && <Typography>Shipping Tax: {currency}{shippingCostDetails.shippingTax}</Typography>}
            </Fragment>
          }
          {Object.keys(tax).length !== 0 && 
            <Fragment>
              {tax.taxType === 'GST' && <Typography>GST: {subTotal * (0.1)}</Typography>}
              {tax.taxType === 'Custom' && 
                <Fragment>
                  {tax.taxOption === 'Percentage' && tax.taxAmount !== '' &&<Typography>Tax : {currency}{parseFloat(tax.taxAmount).toFixed(2)+ '%'}</Typography>}
                  {tax.taxOption === 'Flat' && tax.taxAmount !== '' &&<Typography>Tax : {currency}{parseFloat(tax.taxAmount).toFixed(2)}</Typography>}
                </Fragment>
              }
            </Fragment>
          }
          <Typography>
            total = {currency}{calculateTotal().toFixed(2)}
          </Typography>
          <Button
            onClick={() => {
              setCustomer('');
              setBillingAddress1('');
              setBillingAddress2('');
              setBillingSuburb('');
              setBillingState('');
              setBillingPostCode('');
              setBillingCountry('');
              setShippingAddress1('');
              setShippingAddress2('');
              setShippingSuburb('');
              setShippingState('');
              setShippingPostCode('');
              setShippingCountry('');
              setBankNum('');
              setBankName('');
              setShippingChecked(false);
              setShippingCostDetails({});
              setIssueDate(null);
              setDueDate(null);
              setNotes('');
              setCurrency('$');
              setWideDiscount({});
              setTax({});
              setSubtotal(0);
              setInvoiceItems([]);
              setFormat('PDF');
            }}
          >
            Reset Invoice
          </Button>
          <Button
            type='submit'
            name='save'
          >
            Save
          </Button>
          <Button
            type='submit'
            name='download'
          >
            Download
          </Button>
        </form>
      </Box>
    </Fragment>
  )
}