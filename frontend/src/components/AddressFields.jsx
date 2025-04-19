import { Box, TextField } from "@mui/material";
import { Fragment } from "react";

export default function AddressFields({
  type,
  addressLine1,
  setAddressLine1,
  addressLine2,
  setAddressLine2,
  suburb,
  setSuburb,
  state,
  setState,
  postCode,
  setPostCode,
  country,
  setCountry,
}) {
  return (
    <Fragment>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
        <TextField
          id={`${type}-address-line1`}
          name={`${type}-address-line1`}
          label="Address Line 1"
          value={addressLine1}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setAddressLine1(e.target.value)}
        />
        <TextField
          id={`${type}-address-line2`}
          name={`${type}-address-line2`}
          label="Address Line 2"
          value={addressLine2}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
        <TextField
          id={`${type}-suburb`}
          name={`${type}-suburb`}
          label="Suburb"
          value={suburb}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setSuburb(e.target.value)}
        />
        <TextField
          id={`${type}-state`}
          name={`${type}-state`}
          label="State"
          value={state}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setState(e.target.value)}
        />
        <TextField
          id={`${type}-postcode`}
          name={`${type}-postcode`}
          label="Post Code"
          value={postCode}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setPostCode(e.target.value)}
        />
        <TextField
          id={`${type}-country`}
          name={`${type}-country`}
          label="Country"
          value={country}
          variant="outlined"
          autoComplete="on"
          sx={{ width: '100%' }}
          onChange={(e) => setCountry(e.target.value)}
        />
      </Box>
    </Fragment>
  );
}
