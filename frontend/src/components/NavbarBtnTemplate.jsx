import { Button } from '@mui/material';
import { Fragment } from 'react';

/**
 * This component is the template for the action button that appears on the navbar
 * (either the login or logout button)
 */
export default function NavbarBtnTemplate({ onClick, title, styles }) {
  return (
    <Fragment>
      <Button 
        onClick={onClick}
        variant='outlined' 
        sx={{
          height: 45,
          width: 95,
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '1.05em',
          borderRadius: '15px',
          color: '#60a5fa',
          borderColor: '#60a5fa',
          '&:hover': {
            borderColor: '#3b82f6',
            color: '#3b82f6',
            backgroundColor: 'rgba(96, 165, 250, 0.05)',
          },
          ...styles,
        }}
      >
        {title}
      </Button>
    </Fragment>
  );
}
