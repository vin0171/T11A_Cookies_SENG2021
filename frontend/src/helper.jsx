// Helper Functions
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/cpp'
import styled from "styled-components";
import { MenuItem, TextField } from '@mui/material';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);

export const formInputStyle = {
  '& label.Mui-focused': {
    color: '#6f4e7d'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#6f4e7d'
  },
  width: '70%'
}

export const loginRegisterFormStyle = (
  styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 350px;
    align-items: center;
    @media (max-width: 445px) {
      width: 100%;
    }
  `
)

export function SelectField({
  id,
  name,
  label,
  value,
  options,
  setValue,
}) {
  return (
    <TextField
      id={id}
      name={name}
      select
      label={label}
      value={value}
      variant="standard"
      sx={{ mt: 1.875, ...formInputStyle }}
      slotProps={{
        htmlInput: { id: name },
        inputLabel: { htmlFor: name }
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={option.label}
          value={option.label}
          onClick={() => setValue(option.label)}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export const makeInvoiceParams = (
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
  invoiceItems,
  format
) => {
  const calculateTotal = () => {
    let total = 0
    if (Object.keys(shippingCostDetails).length !== 0) {
      const shippingCost = parseFloat(shippingCostDetails.shippingCost) || 0;
      const shippingTax = parseFloat(shippingCostDetails.shippingTax) || 0;
      total += (shippingCost + shippingTax)
    }

    total += subTotal
    if (Object.keys(wideDiscount).length !== 0) {
      const discountAmount = parseFloat(wideDiscount.discountAmount) || 0;
      if (wideDiscount.discountType === 'Flat') {
        total -= discountAmount
      } else {
        total *= (1 - discountAmount / 100)
      }
    }
    if (Object.keys(tax).length !== 0) {
      const taxAmount = parseFloat(tax.taxAmount) || 0;
      if (tax.taxType === 'GST') {
        total *= (1.1)
      } else if (tax.taxType === 'Custom') {
        if (tax.taxOption === 'Flat') {
          total += taxAmount
        } else {
          total *= (1 + (taxAmount / 100))
        }
      }
    }
    return total
  }

  const billingAddress = {
    addressLine1: billingAddress1,
    addressLine2: billingAddress2,
    suburb: billingSuburb,
    state: billingState,
    postcode: billingPostCode,
    country: billingCountry
  };

  const shippingAddress = {
    addressLine1: shippingAddress1,
    addressLine2: shippingAddress2,
    suburb: shippingSuburb,
    state: shippingState,
    postcode: shippingPostCode,
    country: shippingCountry,
  };

  const participant = {
    companyName: customer,
    billingAddress: billingAddress,
    shippingAddress: shippingAddress,
    email: customerEmail,
    bankName: bankName,
    bankAccount: bankNum
  }

  const items = invoiceItems.map((item) => {
    const itemQuantity = parseInt(item.quantity || 0);
    const unitPrice = parseInt(item.unitPrice || 0);
    const discountAmount = parseInt(item.discountAmount || 0);
    const total = itemQuantity * unitPrice
    return {
      id: item.id,
      isNew: false,
      itemSku: item.itemSku,
      itemName: item.itemName,
      description: item.description,
      quantity: itemQuantity,
      unitPrice: unitPrice, 
      discountAmount: discountAmount,
      totalAmount: total * (1 - discountAmount / 100)
    };
  });

  const invoiceDetails = {
    receiver: participant,
    issueDate: issueDate,
    dueDate: dueDate,
    invoiceNumber: invoiceNumber,
    shippingChecked: shippingChecked,
    status: 'DRAFT',
    state: 'MAIN',
    items: items,
    wideDiscount: wideDiscount,
    tax: tax,
    format: format,
    currency: currency,
    shippingCostDetails: shippingCostDetails,
    subtotal: subTotal,
    total: calculateTotal(),
    notes: notes
  }
  return invoiceDetails;
}

