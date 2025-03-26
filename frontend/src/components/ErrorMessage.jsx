import { Typography } from '@mui/material';
import { Fragment } from 'react';

/**
 * This component formats and sets an error message given a set of styles and an
 * error message
 */
export default function ErrorMessage({error, styles}) {
  return (
    <Fragment>
      <Typography 
        sx={{
          color: 'darkred',
          ...styles
        }}>
        {error}
      </Typography>
    </Fragment>
  )
}