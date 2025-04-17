import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from './test.pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Box } from '@mui/material';

export default function PDFpreview() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

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