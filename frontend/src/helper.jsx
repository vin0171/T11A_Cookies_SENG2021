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

