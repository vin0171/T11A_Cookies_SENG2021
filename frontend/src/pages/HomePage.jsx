import { Box, Button, Divider, styled, SvgIcon, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageFeatures from '../components/HomePageFeatures';
import HomePagePricing from '../components/HomePagePricing';
import HomePageFooter from '../components/HomePageFooter';
import dashboard from '../assets/dashboard.jpg'

/**
 * This page sets up the home page.
 */
export default function HomePage ({token}) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: '#e2dacd',
          width: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(199, 74.70%, 38.80%), transparent)',
        }}
      >
        <Box 
          sx ={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 20,
            pb: 12 ,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
              width: '70%'
            }}
          >
            <Typography
              variant='h1'
              sx={{
                display:'flex',
                alignItems: 'center',
                fontSize: '1.5em'
              }}
            >
              Streamline Invoices&nbsp; 
              <Typography sx={{fontSize: 'inherit', color: 'blue'}}>
                Effortlessly
              </Typography>
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'grey',
                width: '80%'
              }}
            > 
              This is a description hello guys hi hi hi welcome to the invoice page.
            </Typography>
            <Button sx={{
              textTransform: 'none',
              background: "cornflowerblue",
              color: "white",
              padding: "0.35em",
              paddingLeft: "1.2em",
              fontSize: "17px",
              fontWeight: 500,
              borderRadius: "0.9em",
              border: "none",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              boxShadow: "inset 0 0 1.6em -0.6em cornflowerblue",
              overflow: "hidden",
              position: "relative",
              height: "2.8em",
              paddingRight: "3.3em",
              cursor: "pointer",
              "&:hover .icon": {
                width: "calc(100% - 0.6em)",
              },
              "&:hover .icon svg": {
                transform: "translateX(0.1em)",
              },
              "&:active .icon": {
                transform: "scale(0.95)",
              },
            }}
            >
              Get Started
              <Box
                className='icon'
                sx={{
                  background: 'white',
                  marginLeft: '1em',
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '2.2em',
                  width: '2.2em',
                  borderRadius: '0.7em',
                  right: '0.3em',
                  transition: 'all 0.3s',
                }}              
              >
                <SvgIcon
                  sx={{
                    width: "1.1em",
                    transition: "transform 0.3s",
                    color: "cornflowerblue",
                  }}
                >
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </SvgIcon>
              </Box>
            </Button>
          </Box>
          <Box
            sx={{
              alignSelf: "center",
              width: "100%",
              height: 400,
              outline: "6px solid",
              outlineColor: "hsla(220, 25%, 80%, 0.2)",
              border: "1px solid",
              boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
              backgroundImage: `url(${dashboard})`,
              backgroundSize: 'cover'
            }}
          >
          </Box>
        </Box>
      </Box>
      <HomePageFeatures/>
      <Divider sx={{mt: 5, borderColor: 'black'}}/>
      <HomePagePricing/>
      <HomePageFooter/>
    </Fragment>
  )
}
