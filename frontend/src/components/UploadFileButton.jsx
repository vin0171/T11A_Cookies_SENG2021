import { useState } from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';
import { API_URL } from '../App';
import FileUploadIcon from '@mui/icons-material/FileUpload'; 


export default function FileUploadButton({ onUpload })  {
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [, setResult] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setUploadedFile(null);
    setResult(null);
    setOpen(false);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const xmlString = reader.result;

      try {
        const response = await axios.post(`${API_URL}/v1/invoice/read`, {
          ublInvoice: xmlString,
        });

        const parsedData = response.data;
        setResult(parsedData);
        console.log('Parsed invoice data:', parsedData);
        onUpload?.(parsedData);

        handleClose(); 
      } catch (error) {
        const err = error;
        console.error('Error reading invoice:', err.response?.data || err.message);
        alert('Failed to parse invoice.');
      }
    };

    reader.readAsText(uploadedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/xml': ['.xml'] },
    onDrop: (acceptedFiles) => {
      const xmlFile = acceptedFiles.find(file => file.name.endsWith('.xml'));
      if (!xmlFile) {
        alert('Please upload a valid .xml file!');
        return;
      }

      setUploadedFile(xmlFile);
    }
  });

  return (
    <>
      <Button 
        variant='contained' 
        sx={{mb: 5, bgcolor: 'cornflowerblue', textTransform: 'none', fontSize: '1.15em'}}
        onClick={handleOpen}
        endIcon={<FileUploadIcon/>}
      > 
        Upload XML
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            outline: 'none'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload your XML file
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              mt: 2,
              p: 4,
              border: '2px dashed #ccc',
              borderRadius: 2,
              backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <input {...getInputProps()} />
            <DescriptionIcon sx={{ fontSize: 48, color: '#90caf9', mb: 1 }} />
            <Typography variant="body2">
              {isDragActive
                ? 'Drop the XML here...'
                : 'Drag & drop or click to select a .xml file'}
            </Typography>
          </Box>

          {uploadedFile && (
            <Box mt={2}>
              <Typography variant="body2">
                Selected file: {uploadedFile.name}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleUpload}
              >
                Upload and Parse
              </Button>
            </Box>
          )}

        </Box>
      </Modal>
    </>
  );
}
