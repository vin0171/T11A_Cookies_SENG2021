import { Button } from '@mui/material';
import { Fragment } from 'react';

/**
 * This component is the template for the action button that appears on the navbar
 * (either the login or logout button)
 */
export default function NavbarBtnTemplate({ onClick, title}) {
  return (
    <Fragment>
      <Button 
        onClick={onClick}
        color='inherit'
        variant='outlined' 
        sx={{
          height: 45,
          width: 95,
          fontWeight: 'bold',
          textTransform: 'none',
          fontSize: '1.05em'
        }}>
        {title}
      </Button>
    </Fragment>
  )
}