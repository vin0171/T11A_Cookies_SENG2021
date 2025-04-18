import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { makeInvoiceParams, SelectField, clickableTextStyle } from "../helper";
import InvoiceItemTable from "../components/InvoiceItemTable";
import InvoiceDiscountDialog from "../components/InvoiceDiscountDialog";
import FileUploadIcon from '@mui/icons-material/FileUpload'; 
import ShippingCostDialog from "../components/ShippingCostDialog";
import axios from "axios";
import { API_URL } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { saveAs } from 'file-saver';
import TaxDialog from "../components/TaxDialog";
import dayjs from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PreviewInvoice from "../components/PreviewInvoice";
import CustomerField from "../components/CustomerField";
import CustomerAdditionalFields from "../components/CustomerAdditionalFields";
import ItemField from "../components/ItemField";
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
    const invoiceDetails = makeInvoiceParams(
      customer,
      customerEmail,
      billingAddress1,
      billingAddress2,
      billingSuburb,
      billingState,
      billingPostCode,
      billingCountry,
      shippingAddress1,
      shippingAddress2,
      shippingSuburb,
      shippingState,
      shippingPostCode,
      shippingCountry,
      invoiceNumber,
      bankNum,
      bankName,
      shippingChecked,
      shippingCostDetails,
      issueDate,
      dueDate,
      notes,
      currency,
      wideDiscount,
      tax,
      subTotal,
      invoiceItems,
      format
    );
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
      .then(() => {navigate('/dashboard')})
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
  ];

  const invoiceNumberOptions = [
    {label: 'Invoices sent to this customer'},
    {label: 'Total number of invoices sent'},
    {label: 'Custom'}
  ];

  const [customerType, setCustomerType] = useState('Create a New Customer');
  const [customerAdditionalFields, setCustomerAdditionalFields] = useState(false);
  const [customerAdditonalText, setCustomerAdditionalText] = useState('Add Additional Details');
  const [invoiceNumberOption, setInvoiceNumberOption] = useState('Custom');
  const [itemType, setItemType] = useState('Add Existing Item');
  const [blur, setBlur] = useState(false);
  const [discountType, setDiscountType] = useState('Flat');
  const [discountAmount, setDiscountAmount] = useState('');

  useEffect(() => {
    if (customerAdditionalFields){
      setCustomerAdditionalText('Cancel');
    } else {
      setCustomerAdditionalText('Add Additional Details');
    }
  }, [customerAdditionalFields])

  return (
    <Fragment>
      <Box sx={{display: 'flex', height: '100%', width: '80%', justifyContent: 'center', alignSelf: 'center'}}>
        <Box
          component='form' 
          onSubmit={handleSubmit} 
          sx={{display: 'flex', height: '100%', width: '100%'}}
          onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault()}}}
          >
          <Box sx={{width: '100%'}}>
            <Box sx={{height: '100%', p: 3.125}}>
              <Button 
                variant='contained' 
                sx={{mb: 5, bgcolor: 'cornflowerblue', textTransform: 'none', fontSize: '1.15em'}}
                endIcon={<FileUploadIcon/>}
              > 
                Upload Order Document 
              </Button>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  <Typography sx={{fontWeight: 'bold', fontSize: '1.5em'}}>Customer</Typography>
                  <Box sx={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                    <CustomerField
                      customerType={customerType}
                      setCustomerType={setCustomerType}
                      customer={customer}
                      setCustomer={setCustomer}
                      customerEmail={customerEmail}
                      setCustomerEmail={setCustomerEmail}
                      customerAdditionalFields={customerAdditionalFields}
                      setCustomerAdditionalFields={setCustomerAdditionalFields}
                      customerAdditonalText={customerAdditonalText}
                      setBlur={setBlur}
                    />
                    <CustomerAdditionalFields
                      customerAdditionalFields={customerAdditionalFields}
                      billingAddress1={billingAddress1}
                      setBillingAddress1={setBillingAddress1}
                      billingAddress2={billingAddress2}
                      setBillingAddress2={setBillingAddress2}
                      billingSuburb={billingSuburb}
                      setBillingSuburb={setBillingSuburb}
                      billingState={billingState}
                      setBillingState={setBillingState}
                      billingPostCode={billingPostCode}
                      setBillingPostCode={setBillingPostCode}
                      billingCountry={billingCountry}
                      setBillingCountry={setBillingCountry}
                      shippingChecked={shippingChecked}
                      setShippingChecked={setShippingChecked}
                      shippingAddress1={shippingAddress1}
                      setShippingAddress1={setShippingAddress1}
                      shippingAddress2={shippingAddress2}
                      setShippingAddress2={setShippingAddress2}
                      shippingSuburb={shippingSuburb}
                      setShippingSuburb={setShippingSuburb}
                      shippingState={shippingState}
                      setShippingState={setShippingState}
                      shippingPostCode={shippingPostCode}
                      setShippingPostCode={setShippingPostCode}
                      shippingCountry={shippingCountry}
                      setShippingCountry={setShippingCountry}
                      bankName={bankName}
                      setBankName={setBankName}
                      bankNum={bankNum}
                      setBankNum={setBankNum}
                      setBlur={setBlur}
                    />
                  </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px', mt: 2}}>
                  <Typography sx={{fontWeight: 'bold', fontSize: '1.5em'}}>Date</Typography>
                  <Box sx={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label='Issue Date'
                        name='issue-date'
                        value={issueDate}
                        onChange={(newValue) => setIssueDate(newValue)}
                        onBlur={() => (setBlur(true))}
                        
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker 
                        label='Due Date'
                        name='due-date'
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        onBlur={() => (setBlur(true))}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Typography 
                  sx={{
                    fontWeight: 'bold', 
                    fontSize: '1.5em',
                    mt: 3
                  }}
                >
                  Invoice Details
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <Box sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                    <Typography>Recurring</Typography>
                    <Checkbox
                      slotProps={{
                        input: {'aria-label': 'controlled'}
                      }}
                    />
                  </Box>
                  <SelectField
                    id={'invoice-number-option-id'}
                    name={'invoice-number-option'}
                    label={'Invoice Number'}
                    value={invoiceNumberOption}
                    options={invoiceNumberOptions}
                    setValue={setInvoiceNumberOption}
                    setBlur={setBlur}
                  />
                  {invoiceNumberOption === 'Custom' && 
                    <TextField
                      required
                      fullWidth
                      margin='dense'
                      id='invoice-num'
                      name='invoice-num'
                      label='Invoice Number'
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      onBlur={() => (setBlur(true))}
                      type='number'
                      variant='standard'
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
                  }
                  <SelectField
                    id={'currency-id'}
                    name={'currency'}
                    label={'Currency'}
                    value={currency}
                    options={currencyOptions}
                    setValue={setCurrency}
                    setBlur={setBlur}
                  />     
                  <SelectField
                    id={'format-id'}
                    name={'format'}
                    label={'Format'}
                    value={format}
                    options={formatOptions}
                    setValue={setFormat}
                    setBlur={setBlur}
                  />     
                  <TextField
                    id='notes'
                    name='notes'
                    label='Notes'
                    multiline
                    maxRows={4}
                    value={notes}
                    variant='outlined'
                    sx={{width: '100%', mt: 1}}
                    onChange={(e) => setNotes(e.target.value)}
                    onBlur={() => setBlur(true)}
                  />
                  <Box sx={{display: 'flex', gap: '20px'}}>
                    <InvoiceDiscountDialog 
                      setWideDiscount={setWideDiscount}
                      discountType={discountType}
                      setDiscountType={setDiscountType}
                      discountAmount={discountAmount}
                      setDiscountAmount={setDiscountAmount}
                    />
                    <ShippingCostDialog setBlur={setBlur} setShippingCostDetails={setShippingCostDetails}/>
                    <TaxDialog setTax={setTax} setBlur={setBlur}/>
                  </Box>
                </Box>
                <Box sx={{mt: 3, display: 'flex', flexDirection: 'column', pb: '30px'}}>
                  <Typography sx={{fontWeight: 'bold', fontSize: '1.5em'}}>Items</Typography>
                  <ItemField 
                    itemType={itemType} 
                    setItemType={setItemType} 
                    setBlur={setBlur}
                    discountType={discountType}
                    setDiscountType={setDiscountType}
                    discountAmount={discountAmount}
                    setDiscountAmount={setDiscountAmount}
                  />
                </Box>
            </Box>
          </Box>
          <Box sx={{p: 3.125, display: 'flex', justifyContent: 'center', width: '100%'}}>
            <PreviewInvoice
              invoiceId={invoiceId} 
              token={token}
              customer={customer}
              setCustomer={setCustomer}
              customerEmail={customerEmail}
              setCustomerEmail={setCustomerEmail}
              billingAddress1={billingAddress1}
              setBillingAddress1={setBillingAddress1}
              billingAddress2={billingAddress2}
              setBillingAddress2={setBillingAddress2}
              billingSuburb={billingSuburb}
              setBillingSuburb={setBillingSuburb}
              billingState={billingState}
              setBillingState={setBillingState}
              billingPostCode={billingPostCode}
              setBillingPostCode={setBillingPostCode}
              billingCountry={billingCountry}
              setBillingCountry={setBillingCountry}
              shippingAddress1={shippingAddress1}
              setShippingAddress1={setShippingAddress1}
              shippingAddress2={shippingAddress2}
              setShippingAddress2={setShippingAddress2}
              shippingSuburb={shippingSuburb}
              setShippingSuburb={setShippingSuburb}
              shippingState={shippingState}
              setShippingState={setShippingState}
              shippingPostCode={shippingPostCode}
              setShippingPostCode={setShippingPostCode}
              shippingCountry={shippingCountry}
              setShippingCountry={setShippingCountry}
              invoiceNumber={invoiceNumber}
              setInvoiceNumber={setInvoiceNumber}
              bankNum={bankNum}
              setBankNum={setBankNum}
              bankName={bankName}
              setBankName={setBankName}
              shippingChecked={shippingChecked}
              setShippingChecked={setShippingChecked}
              shippingCostDetails={shippingCostDetails}
              setShippingCostDetails={setShippingCostDetails}
              issueDate={issueDate}
              setIssueDate={setIssueDate}
              dueDate={dueDate}
              setDueDate={setDueDate}
              notes={notes}
              setNotes={setNotes}
              currency={currency}
              setCurrency={setCurrency}
              wideDiscount={wideDiscount}
              setWideDiscount={setWideDiscount}
              tax={tax}
              setTax={setTax}
              subTotal={subTotal}
              setSubtotal={setSubtotal}
              total={calculateTotal()}
              invoiceItems={invoiceItems}
              setInvoiceItems={setInvoiceItems}
              format={format}
              setFormat={setFormat}
              blur={blur} 
              setBlur={setBlur} 
              handleSubmit={handleSubmit}
            />
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}