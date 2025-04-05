import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { Button, Typography } from "@mui/material";

export default function InvoiceItemTable({rows, setRows, setSubtotal, currency}) {
  useEffect(() => {
    const newSubtotal = rows.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const unitPrice = parseFloat(row.unitPrice) || 0;
      const discount = parseFloat(row.discountAmount) / 100 || 0;
      return acc + quantity * unitPrice * (1 - discount);
    }, 0);
    setSubtotal(newSubtotal)
  }, [rows])
  
  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns = [
    { 
      field: 'quantity', 
      headerName: 'Qty', 
      width: 150,
      editable: true,
      type: 'number',
      cellClassName: 'basic-cell',
    },
    {
      field: 'itemSku',
      headerName: 'Item Sku',
      width: 150,
      editable: true,
      cellClassName: 'basic-cell',
    },
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 150,
      editable: true,
      cellClassName: 'basic-cell',
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      editable: true,
      cellClassName: 'basic-cell',
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      width: 150,
      editable: true,
      type: 'number',
      cellClassName: 'basic-cell',
    },
    {
      field: 'discountAmount',
      headerName: 'Discount (%)',
      width: 150,
      editable: true,
      type: 'number',
      cellClassName: 'basic-cell',
    },
    {
      field: 'total',
      headerName: 'Total',
      sortable: true,
      width: 150,
      cellClassName: 'basic-cell',
      valueGetter: (value, row) => {
        const quantity = parseFloat(row.quantity) || 0;
        const unitPrice = parseFloat(row.unitPrice) || 0;
        const discount = parseFloat(row.discountAmount) / 100 || 0;
        if (quantity === 0 || unitPrice === 0) {
          return '0'
        }
        return `${currency}${(quantity * unitPrice * (1 - discount)).toFixed(2)}`;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Delete Row',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }
  ];

  const EditToolbar = ({ setRows, numRows }) => {
    const handleClick = () => {
      const id = numRows + 1;
      setRows((oldRows) => [
        ...oldRows,
        {
          id,
          quantity: '',
          itemSku: '',
          itemName: '',
          description: '',
          unitPrice: '',
          discountAmount: '',
          isNew: true,
        },
    ]);
  }

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}
  return (
    <Box 
      sx={{ 
        height: 400, 
        width: '100%',
        '& .basic-cell': {
          padding: '10px !important'
        }
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, numRows: rows.length },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        processRowUpdate={processRowUpdate}
        getRowHeight={() => 'auto'}
        sx={{
          "& .MuiDataGrid-cell": {
            minHeight: 40,
          },
        }}
      />
    </Box>
  );
}