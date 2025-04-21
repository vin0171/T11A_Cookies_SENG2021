import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem
} from '@mui/material';
import axios from 'axios';
import { API_URL } from '../App';

export default function InvoicesPage() {
  const [sort, setSort] = useState('');
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch companyId using token
        const userDetailsRes = await axios.get(`${API_URL}/v3/user/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const companyId = userDetailsRes.data.companyId;

        // Fetch invoices using companyId
        const response = await axios.get(`${API_URL}/v3/company/${companyId}/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)

        setInvoices(response.data);
      } catch (err) {
        console.error('Failed to fetch invoices:', err);
      }
    };

    fetchInvoices();
  }, []);

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sort === 'number') return a.invoiceId.localeCompare(b.invoiceId);
    if (sort === 'amount') return b.details?.totalAmount - a.details?.totalAmount;
    return 0;
  });

  return (
    <Box sx={{ mt: '75px', px: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Invoices
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
            sx={{
              bgcolor: '#e3f2fd',
              height: '36px',
              borderRadius: '6px',
              '.MuiOutlinedInput-notchedOutline': { border: '1px solid #90caf9' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#42a5f5' }
            }}
          >
            <MenuItem value="">Sort By</MenuItem>
            <MenuItem value="number">Invoice #</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </Select>
        </Box>
      </Box>
            
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount ($)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedInvoices.map((inv, i) => (
              <TableRow key={i}>
                <TableCell>{inv.details.invoiceNumber}</TableCell>
                <TableCell>{inv.details.receiver.name || '—'}</TableCell>
                <TableCell>{inv.details.total ?? '-'}</TableCell>
                <TableCell>{new Date(inv.details?.issueDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
