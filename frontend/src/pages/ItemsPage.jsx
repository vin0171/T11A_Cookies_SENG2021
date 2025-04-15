import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from '@mui/material';

const dummyItems = [
  { name: 'Laptop Pro 15"', sku: 'LP-015', price: 1800, stock: 12 },
  { name: 'Wireless Mouse', sku: 'WM-001', price: 45, stock: 58 },
  { name: 'Mechanical Keyboard', sku: 'MK-201', price: 120, stock: 34 },
  { name: 'Monitor 27"', sku: 'MN-270', price: 350, stock: 8 },
];

export default function ItemsPage() {
  const [sort, setSort] = useState('');

  const sortedItems = [...dummyItems].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'price') return b.price - a.price;
    if (sort === 'stock') return b.stock - a.stock;
    return 0;
  });

  return (
    <Box sx={{ mt: '75px', px: 4, fontFamily: `'Segoe UI', sans-serif` }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Inventory
        </Typography>

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
          <MenuItem value="name">Name (A-Z)</MenuItem>
          <MenuItem value="price">Price (High → Low)</MenuItem>
          <MenuItem value="stock">Stock (High → Low)</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price ($)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
