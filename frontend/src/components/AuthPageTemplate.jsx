import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import Cookie from '../assets/logonew.png'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../style.css';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';


/**
 * This component is a template for the box that appears on the login or register page
 * It takes in three arguments. 'authType' is the type of authentication that needs to be done (login or register) 
 * and 'styles' is any css styles passed in which modify the template and 
 * 'children' is the form that is used on the auth page.
 */
export default function AuthPageTemplate({ 
  authType, 
  styles, 
  children, 
}) {
  const { titleHeight, gap } = styles;
  const navigate = useNavigate();
  return (
    <Fragment>
      <Box 
        className='form-background'  
        sx={{
          display: 'flex',
          flexDirection: 'column', 
          height: '100%', 
          width: '100%', 
          justifyContent: 'center', 
          alignItems: 'center'
          }}
        >
        <Box
          sx={{
            height: '100%', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'rgba(181, 210, 246, 0.6)', 
            backdropFilter: 'blur(3px)'
            }}
          >
          <Box 
            sx ={{
              height: '80%', 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center'
              }}
            >
            <Box 
              sx={{
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'aliceblue', 
                height: '100%', 
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25,
                border: '5px solid black',
                width: '40%',
                borderRight: '0'
                }}
              >
                <Box 
                  sx={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    width: '100%', 
                    alignItems: 'center', 
                    gap: '15%'
                    }}
                  >
                    <IconButton sx={{alignSelf: 'start', color: 'black'}} onClick={() => navigate('/')}>
                      <ArrowBackIcon sx={{fontSize: '2em'}}/>
                    </IconButton>
                    <Box
                      sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '60%', 
                        width: '100%', 
                        alignItems: 'center', 
                        gap: '10%'
                      }}
                    >
                      <Box 
                        component="img" 
                        sx={{height: '100px', marginTop: '100px'}}
                        src={Cookie}
                      />
                  </Box>
                </Box>
            </Box>
            <Box 
              sx={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent:'center', 
                alignItems: 'center', 
                bgcolor: 'aliceblue', 
                height: '100%', 
                borderTopRightRadius: 25,
                borderBottomRightRadius: 25,
                border: '5px solid black',
                width: '30%'
                }}
              >
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                  <Box 
                    sx={{
                      height: titleHeight, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-evenly', 
                      alignItems: 'center', 
                    }}
                    >
                    <Typography sx={{fontWeight: 'bold', fontSize: '3em'}}>
                      {authType}
                    </Typography>
                  </Box>
                  {children}
                </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
    
  )
}