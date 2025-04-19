import { Box, Checkbox, TextField, Typography } from "@mui/material"
import { Fragment } from "react"
import AddressFields from "./AddressFields"
import { clickableTextStyle } from "../helper"

export default function CustomerAdditionalFields({
  customerAdditionalFields,
  billingAddress1,
  setBillingAddress1,
  billingAddress2,
  setBillingAddress2,
  billingSuburb,
  setBillingSuburb,
  billingState,
  setBillingState,
  billingPostCode,
  setBillingPostCode,
  billingCountry,
  setBillingCountry,
  shippingChecked,
  setShippingChecked,
  shippingAddress1,
  setShippingAddress1,
  shippingAddress2,
  setShippingAddress2,
  shippingSuburb,
  setShippingSuburb,
  shippingState,
  setShippingState,
  shippingPostCode,
  setShippingPostCode,
  shippingCountry,
  setShippingCountry,
  bankName,
  setBankName,
  bankNum,
  setBankNum,
  handleCreateCustomer
}) {
  return (
    <Fragment>
      {customerAdditionalFields &&
      <Box>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
          <Typography sx={{fontWeight: 'bold', fontSize: '1.5em'}}>Billing Address</Typography>
          <AddressFields
            type='billing'
            addressLine1={billingAddress1}
            setAddressLine1={setBillingAddress1}
            addressLine2={billingAddress2}
            setAddressLine2={setBillingAddress2}
            suburb={billingSuburb}
            setSuburb={setBillingSuburb}
            state={billingState}
            setState={setBillingState}
            postCode={billingPostCode}
            setPostCode={setBillingPostCode}
            country={billingCountry}
            setCountry={setBillingCountry}
          />
        </Box>
        <Box>
          <Typography sx={{fontWeight: 'bold', fontSize: '1.5em', mt: 5}}>
            Shipping Address
          </Typography>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <Typography>Same as Billing Address</Typography>
            <Checkbox
              checked={shippingChecked}
              onChange={(event) => {
                setShippingChecked(event.target.checked)
              }}
              slotProps={{
                input: {'aria-label': 'controlled'}
              }}
            />
          </Box>
          {!shippingChecked && 
            <AddressFields
              type='shipping'
              addressLine1={shippingAddress1}
              setAddressLine1={setShippingAddress1}
              addressLine2={shippingAddress2}
              setAddressLine2={setShippingAddress2}
              suburb={shippingSuburb}
              setSuburb={setShippingSuburb}
              state={shippingState}
              setState={setShippingState}
              postCode={shippingPostCode}
              setPostCode={setShippingPostCode}
              country={shippingCountry}
              setCountry={setShippingCountry}
            />
          }
        </Box>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column', 
            gap: '20px', 
            ...(!shippingChecked && {mt: 4})
          }}
        >
          <Typography sx={{fontWeight: 'bold', fontSize: '1.5em'}}>Bank Information</Typography>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <TextField
              id='bank-name'
              name='bank-name'
              label='Bank Name'
              value={bankName}
              variant='outlined'
              autoComplete='on'
              sx={{ width: '100%' }}
              onChange={(e) => setBankName(e.target.value)}
            />
            <TextField
              id='bank-number'
              name='bank-number'
              label='Bank Account Number'
              type='number'
              value={bankNum}
              variant='outlined'
              autoComplete='on'
              sx={{ width: '100%' }}
              onChange={(e) => setBankNum(e.target.value)}
            />
          </Box>
        </Box>
        <Box sx={{mt: 3, width: '100%', display: 'flex', justifyContent: 'end'}}>
          <Typography 
            sx={{...clickableTextStyle, width: 'fit-content'}}
            onClick={handleCreateCustomer}
            type='submit'
          >
            Confirm
          </Typography>
        </Box>
      </Box>
      }
    </Fragment>
  )
}