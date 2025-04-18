import { Fragment } from "react";
import { SelectField, clickableTextStyle } from "../helper";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";

const customerTypeOptions = [
  {label: 'Create a New Customer'},
  {label: 'Existing Customer'}
];

export default function CustomerField({
  customerType,
  setCustomerType,
  customer,
  setCustomer,
  customerEmail,
  setCustomerEmail,
  customerAdditionalFields,
  setCustomerAdditionalFields,
  customerAdditonalText,
  setBlur,
  customerList,
  handleCreateCustomer
}) {

  const existingCustomersOptions = Object.values(customerList).map((c) => ({
    label: c.name
  }));

  return (
    <Fragment>
      <SelectField
        id={'customer-type-id'}
        name={'customer-type'}
        label={'Create or Find a Customer'}
        value={customerType}
        options={customerTypeOptions}
        setValue={setCustomerType}
      />
      {customerType === 'Existing Customer' ? 
        <Autocomplete
          disablePortal
          options={existingCustomersOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label='Customer' />}
          onChange={(event, newValue) => setCustomer(newValue.label)}
          onBlur={() => (setBlur(true))}
        />
        :
        <Fragment>
          <TextField
            id='customer-name'
            name='customer-name'
            label='Customer'
            value={customer}
            variant='outlined'
            autoComplete='on'
            sx={{ width: '100%' }}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <TextField
            id='customer-email'
            name='customer-email'
            label='Customer Email'
            value={customerEmail}
            variant='outlined'
            type='email'
            autoComplete='on'
            sx={{ width: '100%' }}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography 
              onClick={() => setCustomerAdditionalFields(!customerAdditionalFields)}
              sx={{...clickableTextStyle}}
            >
              {customerAdditonalText}
            </Typography>
            {customerAdditonalText === 'Add Additional Details' && 
            <Typography 
              sx={{...clickableTextStyle}}
              onClick={handleCreateCustomer}
              type='submit'
            >
              Confirm
            </Typography>
            }
          </Box>
        </Fragment>
      }
    </Fragment>
  )
}