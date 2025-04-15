import Typography from '@mui/material/Typography';
import Cookie from '../assets/cookie.svg'
import { Box } from '@mui/material';

/**
 * This component renders the skeleton for the Cookie logo (i.e its background colour and text).
 * If this component is used it should have a width, height and added customisations added.
 */
export default function CookieLogo({styles = {}, handleClick={}}) {
  return (
    <Box sx={{display: 'flex', gap: '20px', alignItems: 'center'}}>
      <Box component='img' src={Cookie} sx={{width: '25%'}}></Box>
      <Typography
        noWrap
        component='h3'
        onClick={handleClick}
        sx={{	
          fontWeight: 'bold',
          letterSpacing: 1,
          '&:hover': {
            cursor: 'default'
          },
          ...styles
        }}>
      Cookie	
      </Typography>
    </Box>
  )
}