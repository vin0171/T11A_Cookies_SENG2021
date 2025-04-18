import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button } from '@mui/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from 'axios';
import { API_URL } from '../App';
pdfMake.addVirtualFileSystem(pdfFonts);

export default function PreviewInvoice({
  token,
  invoiceId,
  customer,
  setCustomer,
  customerEmail,
  setCustomerEmail,
  billingAddress1,
  setBillingAddress1,
  billingAddress2,
  setBillingAddress2,
  billingSuburb,
  setBillingSuburb,
  billingState,
  setBillingState,
  billingPostCode,
  setBillingPostCode,
  billingCountry,
  setBillingCountry,
  shippingAddress1,
  setShippingAddress1,
  shippingAddress2,
  setShippingAddress2,
  shippingSuburb,
  setShippingSuburb,
  shippingState,
  setShippingState,
  shippingPostCode,
  setShippingPostCode,
  shippingCountry,
  setShippingCountry,
  invoiceNumber,
  setInvoiceNumber,
  bankNum,
  setBankNum,
  bankName,
  setBankName,
  shippingChecked,
  setShippingChecked,
  shippingCostDetails,
  setShippingCostDetails,
  issueDate,
  setIssueDate,
  dueDate,
  setDueDate,
  notes,
  setNotes,
  currency,
  setCurrency,
  wideDiscount,
  setWideDiscount,
  tax,
  setTax,
  subTotal,
  setSubtotal,
  total,
  invoiceItems,
  setInvoiceItems,
  addedItems,
  setAddedItems,
  format,
  setFormat,
  blur,
  setBlur,
  handleSubmit
}) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPDF] =  useState('');
  const [company, setCompany] = useState(null);
  useEffect(() => {
    if (company) {
      renderPdf();
      setBlur(false);
    }
  }, [blur, company]);

  useEffect(() => {
    axios.get(`${API_URL}/v1/user/details`, {
      headers: {Authorization: `Bearer ${token}`},
    }).then((res) => {
      axios.get(`${API_URL}/v1/company/${res.data.companyId}`, {
        headers: {Authorization: `Bearer ${token}`},
      }).then((res) => {
        setCompany(res.data)
      })
    }).catch(error => console.log(error.data.response.error))
  }, [])

  const renderPdf = () => {
    const receiverAddress = [
      billingAddress1, 
      billingAddress2,
      billingSuburb,
      billingState,
      billingPostCode,
      billingCountry
    ].filter(part => part).join(', ');

    const docDefinition = {
      content: [
        { text: 'Invoice', style: 'header' },
        {
          columns: [
            { text: `From:\n${company.name}\n${company.headquarters.address}`, width: '50%' },
            { text: `To:\n${customer}\n${receiverAddress}`, width: '50%', alignment: 'right' },
          ]
        },
        { text: `Invoice #: ${invoiceNumber}`, margin: [0, 10] },
        { text: `Issue Date: ${new Date(issueDate).toLocaleDateString()}` },
        { text: `Due Date: ${new Date(dueDate).toLocaleDateString()}` },
        {
          style: 'tableExample',
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Description', 'Qty', 'Unit Price', 'Total'],
              ...addedItems.map((i) => [
                i.description,
                i.qty,
                `${currency} ${i.price}`,
                `${currency} ${i.qty * i.price}`
              ]),
              [
                { text: 'Total', colSpan: 3, alignment: 'right' }, {}, {},
                `${currency} ${subTotal.toFixed(2)} ${total.toFixed(2)}`
              ]
            ]
          },
          layout: 'lightHorizontalLines',
          margin: [0, 20]
        },
          notes ? { text: `Notes: ${notes}` } : null,
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
        tableExample: { margin: [0, 5, 0, 15] }
      }
    };
    const gen = pdfMake.createPdf(docDefinition);
    gen.getDataUrl((dataUrl) => setPDF(dataUrl));
    
  }
  
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Box sx={{height: '100%'}}>
      <Document 
        file={pdf} 
        onLoadSuccess={onDocumentLoadSuccess} 
        renderTextlayer={false} 
        renderAnnotationLayer={false}
      >
        <Page pageNumber={pageNumber} />
      </Document>
        <Box 
          sx={{mt: 5, display: 'flex', justifyContent: 'space-between'}}
        >
        <Button
          sx={{minWidth: '100px', bgcolor: 'red', textTransform: 'none', fontSize: '1em'}}
          endIcon={<RestartAltIcon/>}
          variant='contained'
          onClick={() => {
            setCustomer('');
            setCustomerEmail('')
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
            setInvoiceNumber('');
            setInvoiceItems([]);
            setFormat('PDF');
          }}
        >
          Reset Invoice
        </Button>
        <Button
          sx={{width: '135px', bgcolor: 'cornflowerblue', textTransform: 'none', fontSize: '1em'}}
          endIcon={<SaveIcon/>}
          type='submit'
          onSubmit={handleSubmit}
          variant='contained'
          name='save'
        >
          Save
        </Button>
        <Button
          sx={{width: '135px', bgcolor: 'green', textTransform: 'none', fontSize: '1em'}}
          endIcon={<DownloadIcon/>}
          type='submit'
          onSubmit={handleSubmit}
          variant='contained'
          name='download'
        >
          Download
        </Button>
      </Box>
    </Box>
  );
}
