import { Box, Button, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * This page sets up the home page.
 */
export default function HomePage ({token}) {
  const navigate = useNavigate();
  const commonBtnStyles = {
    textTransform: 'none', 
    fontWeight: 'bold',
    height: 55,
    fontSize: '1.2em',
    borderRadius: 3.8,
  }

  return (
    <Fragment>
      <Box component='section' sx={{ height: '100%', display: 'grid', gridTemplateRows: '6fr 4fr'}}>
        <Box
          component='section' 
          sx={{ 
            bgcolor: '#9ccde1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', color: '3a3c43', alignItems: 'center', textAlign: 'center'}}>
            <Typography 
              variant='h3' 
              sx={{
                fontWeight: 'bold',  
                '@media (min-width: 569px) and (max-width: 695px)': {
                  width: '80%'
                },
              }}>
              Streamline your invoicing process
            </Typography>
            <br/>
            <Typography 
              variant='h5' 
              sx={{
                '@media (max-width: 675px)' : {
                  width: 400
                }
              }}>
              Start generating, validating, and managing invoices with just a few clicks.
            </Typography>
            {token && 
            <Button
              onClick={() => navigate('/dashboard')}
              variant='contained'
              sx={{ 
                ...commonBtnStyles,
                width: 250,
                color: '#41444d',
                bgcolor: '#e2dacd',
                mt: 6.25
              }}>
                Head to Dashboard
            </Button>
            }
          </Box>
        </Box>
        <Box
          component='section' 
          sx={{ 
            bgcolor: '#white' ,
            flex: 1,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: '#e2dacd'
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
            <Typography 
              variant='h5' 
              sx={{ 
                fontSize: '2em', 
                fontWeight: 'bold',
                color: '#3a3c43',
              }}>
              Not Registered with Us?
            </Typography>
            <Button
              onClick={() => navigate('user/register')}
              variant='contained'
              sx={{ 
                ...commonBtnStyles,
                width: 200,
                bgcolor: '#9ccde1'
              }}>
              Register Now
            </Button>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
