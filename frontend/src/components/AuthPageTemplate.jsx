import { Box, Typography } from '@mui/material';
import PrestoLogo from './PrestoLogo';

/**
 * This component is a template for the box that appears on the login or register page
 * It takes in three arguments. 'authType' is the type of authentication that needs to be done (login or register) 
 * and 'styles' is any css styles passed in which modify the template and 
 * 'children' is the form that is used on the auth page.
 */
export default function AuthPageTemplate({ authType, styles, children, handleLogoClick = () => {}}) {
  const { justifyContent, boxHeight, titleHeight, gap } = styles;
  return (
    <Box component='section' sx={{ height: '100%', display: 'flex'}}>
      <Box 
        component='div' 
        sx={{ 
          width: '100%', 
          background: 'linear-gradient(to right bottom, #3a3c43, #6f4e7d)',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <Box 
          component='section' 
          sx={{ 
            flex: 1, 
            bgcolor: '#e2dacd',
            width: 500,
            borderRadius: 12.5,
            m: 5,
            py: 5,
            px: 2.5,
            display: 'grid',
            alignItems: 'center',
            '@media (max-width: 555px)': {
              width: '80%'
            },
          }}>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: boxHeight,
              alignItems: 'center',
              width: '80%',
              justifySelf: 'center',
              justifyContent: justifyContent,
            }}>
            <Box 
              sx={{
                height: titleHeight, 
                gap: gap,
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-evenly', 
                alignItems: 'center', 
              }}>
              <PrestoLogo
                styles={{
                  height: 85,
                  fontSize: '3.5em',
                  width: 250,
                  color: 'white',
                }}
                handleClick={handleLogoClick}
              />
              <Typography sx={{fontWeight: 'bold', fontSize: '3em'}}>
                {authType}
              </Typography>
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}