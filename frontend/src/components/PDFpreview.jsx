import { useEffect, useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Box } from '@mui/material';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import axios from 'axios';
import { API_URL } from '../App';
pdfMake.addVirtualFileSystem(pdfFonts);

export default function PDFpreview({
  token,
  invoiceId,
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
  total,
  invoiceItems,
  format,
  blur, 
  setBlur
}) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pdf, setPDF] =  useState('');
  const [company, setCompany] = useState(null);
  useEffect(() => {
    renderPdf();
    setBlur(false);
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

    if (company) {
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
                ...invoiceItems.map((i) => [
                  i.description,
                  i.quantity,
                  `${currency} ${i.unitPrice}`,
                  `${currency} ${i.quantity * i.unitPrice}`
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
    </Box>
  );
}
