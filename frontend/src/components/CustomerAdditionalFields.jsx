import { Box, Checkbox, TextField, Typography } from "@mui/material"
import { Fragment } from "react"
import AddressFields from "./AddressFields"

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
  setBankNum
}) {
  return (
    <Fragment>
      {customerAdditionalFields &&
        <Box>
          <Box>
            <Typography>Billing Address</Typography>
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
          <Typography>
            Shipping Address
          </Typography>
          <Box>
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
            {
              !shippingChecked && 
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
        </Box>
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
      }
    </Fragment>
  )
}