import { CircularProgress, Typography, Box } from '@mui/material';
import { Fragment } from 'react';
/**
 * This component formats the loading box that appears when fetching data. 
 * It consists of the loading wheel and the loading text.
 */
export default function LoadingBox({boxStyles = {}, progressStyles ={}}) {
  return (
    <Fragment>
      <Box 
        role='progressbar'
        sx=
          {{ 
            display: 'flex', 
            justifyContent: 'center', 
            pt: '2%', 
            gap: '2%', 
            width: '100%',
            ...boxStyles
          }}>
        <CircularProgress size='3em' sx={{color: '#6f4e7d', ...progressStyles}}/>
        <Typography variant='h3' sx={{}}>Loading...</Typography>
      </Box>
    </Fragment>
  )
}