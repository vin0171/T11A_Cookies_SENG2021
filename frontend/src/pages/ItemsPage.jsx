import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Select, MenuItem
} from '@mui/material';
import axios from 'axios';

export default function ItemsPage() {
  const [sort, setSort] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');

        // Get companyId from user details
        const userDetails = await axios.get('http://localhost:5005/v3/user/details', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const companyId = userDetails.data.companyId;

        // Use companyId to get items
        const response = await axios.get(`http://localhost:5005/v3/company/${companyId}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setItems(response.data.items);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      }
    };

    fetchItems();
  }, []);

  const sortedItems = [...items].sort((a, b) => {
    if (sort === 'name') return a.itemName.localeCompare(b.itemName);
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
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.itemSku}</TableCell>
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
