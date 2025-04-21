import { Box, Button, Divider, SvgIcon, Typography } from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import HomePageFeatures from '../components/HomePageFeatures';
import HomePagePricing from '../components/HomePagePricing';
import HomePageFooter from '../components/HomePageFooter';
import { Typewriter } from 'react-simple-typewriter';

export default function HomePage() {
  const navigate = useNavigate();

  const ublSample = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
  <cbc:ID>12345</cbc:ID>
  <cbc:IssueDate>2025-04-21</cbc:IssueDate>
</Invoice>`;

  return (
    <Fragment>
      <Box
        sx={{
          bgcolor: 'white',
          width: '100%',
          backgroundRepeat: 'no-repeat',
          fontFamily: `'Plus Jakarta Sans', 'Segoe UI', sans-serif`,
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 20,
            pb: 8,
          }}
        >
          {/* Headline */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 1,
              }}
            >
              Streamline Invoices
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#60a5fa',
                letterSpacing: '0.5px',
                WebkitTextStrokeWidth: '0.3px',
              }}
            >
              Effortlessly
            </Typography>
          </Box>

          {/* CTA Button */}
          <Button 
            onClick={() => navigate('/user/register')}
            sx={{
              width: '300px',
              textTransform: 'none',
              background: '#60a5fa',
              color: 'white',
              padding: '0.35em 3.3em 0.35em 1.2em',
              fontSize: '1.5em',
              fontWeight: 500,
              borderRadius: '0.9em',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'inset 0 0 1.6em -0.6em #4f46e5',
              position: 'relative',
              height: '2.8em',
              letterSpacing: '0.03em',
              cursor: 'pointer',
              '&:hover .icon': { width: 'calc(100% - 0.6em)' },
              '&:hover .icon svg': { transform: 'translateX(0.1em)' },
              '&:active .icon': { transform: 'scale(0.95)' },
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
                  width: '1.1em',
                  transition: 'transform 0.3s',
                  color: '#60a5fa',
                }}
              >
                <svg
                  height='24'
                  width='24'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M0 0h24v24H0z' fill='none'></path>
                  <path
                    d='M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z'
                    fill='currentColor'
                  ></path>
                </svg>
              </SvgIcon>
            </Box>
          </Button>

          {/* Typewriter Animation replacing the dashboard */}
          <Box
            sx={{
              mt: 8,
              width: '60%',
              minHeight: 300,
              backgroundColor: '#f8fafc',
              borderRadius: '1em',
              padding: 4,
              boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              color: '#111827',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              border: '1px solid hsla(220, 25%, 80%, 0.5)',
            }}
          >
            <Typewriter
              words={[ublSample]}
              loop={1}
              cursor
              typeSpeed={25}
              deleteSpeed={0}
              delaySpeed={1000}
            />
          </Box>
        </Box>
      </Box>

      {/* Other Sections */}
      <HomePageFeatures />
      <Divider sx={{ pt: 5, borderColor: 'grey', background: 'aliceblue' }} />
      <HomePagePricing />
      <HomePageFooter />
    </Fragment>
  );
}
