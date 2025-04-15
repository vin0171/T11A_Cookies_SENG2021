import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, Button
} from '@mui/material';

const dummyInvoices = [
  { number: 'INV-001', client: 'Alice', amount: 2200, date: '2024-11-01' },
  { number: 'INV-002', client: 'Bob', amount: 450, date: '2024-11-10' },
  { number: 'INV-003', client: 'Charlie', amount: 890, date: '2024-12-02' },
];

export default function InvoicesPage() {
  const [sort, setSort] = useState('');

  const sortedInvoices = [...dummyInvoices].sort((a, b) => {
    if (sort === 'number') return a.number.localeCompare(b.number);
    if (sort === 'amount') return b.amount - a.amount;
    return 0;
  });

  return (
    <Box sx={{ mt: '75px', px: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Invoices
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            displayEmpty
            sx={{
              bgcolor: '#e3f2fd', height: '36px', borderRadius: '6px',
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
                <TableCell>{inv.number}</TableCell>
                <TableCell>{inv.client}</TableCell>
                <TableCell>{inv.amount}</TableCell>
                <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
