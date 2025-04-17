import { Fragment, useState } from "react";
import { SelectField } from "../helper";
import { InputAdornment, TextField } from "@mui/material";

const discountOptions = [
  {label: 'Flat'},
  {label: 'Percentage'}
]

export default function InvoiceDiscountField({type}) {
  const [discountType, setDiscountType] = useState('Flat');
  const [discountAmount, setDiscountAmount] = useState('');

  return (
    <Fragment>
      <SelectField
        id={`${type}-discount-type`}
        name={`${type}-discount-type-name`}
        label={'Select Discount Type'}
        value={discountType}
        options={discountOptions}
        setValue={setDiscountType}        
      />
      <TextField
        id={`${type}-discount-amount`}
        name={`${type}-discount-amount-name`}
        margin='dense'
        value={discountAmount}
        onChange={(e) => setDiscountAmount(e.target.value)}
        variant='standard'
        label='Discount Amount'
        type='number'
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