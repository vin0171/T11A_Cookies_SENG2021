import { Fragment, useState } from "react";
import { removeNumberScrollbarStyle, SelectField } from "../helper";
import { InputAdornment, TextField } from "@mui/material";

const discountOptions = [
  {label: 'Flat'},
  {label: 'Percentage'}
]

export default function InvoiceDiscountField({
  type, 
  discountType,
  setDiscountType,
  discountAmount,
  setDiscountAmount
}) {
  return (
    <Fragment>
      <SelectField
        id={`${type}-discount-type-id`}
        name={`${type}-discount-type`}
        label={'Select Discount Type'}
        value={discountType}
        options={discountOptions}
        setValue={setDiscountType}     
      />
      <TextField
        id={`${type}-discount-amount-id`}
        name={`${type}-discount-amount`}
        margin='dense'
        value={discountAmount}
        onChange={(e) => setDiscountAmount(e.target.value)}
        variant='standard'
        label='Discount Amount'
        type='number'
        sx={{...removeNumberScrollbarStyle, width: '100%'}}
        onWheel={(e) => e.target.blur()}
        slotProps={{
          input: {
            ...(discountType === 'Flat')
              ? { startAdornment: <InputAdornment position='start'>$</InputAdornment>}
              : {endAdornment: <InputAdornment position='end'>%</InputAdornment>}
          },
          htmlInput : {
            ...(discountType === 'Percentage' ? { max: 100 } : {}),
            step: .01
          }
        }}
      />
    </Fragment>
  )
}