import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';

const dummyCustomers = [
  { name: 'Alice', email: 'alice@example.com', amountSpent: 1200, memberSince: '2022-01-01' },
  { name: 'Bob', email: 'bob@example.com', amountSpent: 300, memberSince: '2023-06-15' },
  { name: 'Charlie', email: 'charlie@example.com', amountSpent: 900, memberSince: '2021-09-23' },
  { name: 'Daisy', email: 'daisy@example.com', amountSpent: 1600, memberSince: '2020-05-10' },
];

export default function CustomersPage() {
  const [sort, setSort] = useState('');

  const sortedCustomers = [...dummyCustomers].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'amountSpent') return b.amountSpent - a.amountSpent;
    return 0;
  });

  return (
    <Box sx={{ fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`, mt: '75px', px: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`
          }}
        >
          Customer List
        </Typography>

        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          displayEmpty
          sx={{
            bgcolor: '#e3f2fd',
            fontWeight: 500,
            fontSize: '0.9rem',
            height: '36px',
            borderRadius: '6px',
            boxShadow: 'none',
            '.MuiOutlinedInput-notchedOutline': { border: '1px solid #90caf9' },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#42a5f5',
            }
          }}
        >
          <MenuItem value="">Sort By</MenuItem>
          <MenuItem value="name">Alphabetical</MenuItem>
          <MenuItem value="amountSpent">Highest Spender</MenuItem>
        </Select>
      </Box>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount Spent ($)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Member Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCustomers.map((cust, i) => (
              <TableRow key={i}>
                <TableCell>{cust.name}</TableCell>
                <TableCell>{cust.email}</TableCell>
                <TableCell>{cust.amountSpent}</TableCell>
                <TableCell>{new Date(cust.memberSince).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
