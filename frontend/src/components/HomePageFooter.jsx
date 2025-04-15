import { Box, Icon, Link, Typography } from "@mui/material";
import CookieLogo from '../assets/cookie.svg'

const footerInfo = [
  {
    title: 'Product',
    links: [
      'Features',
      'Pricing',
      'FAQs'
    ], 
  },
  {
    title: 'Company',
    links: [
      'About Us',
      'Careers',
    ], 
  },
  {
    title: 'Legal',
    links: [
      'Terms',
      'Privacy',
      'Contact'
    ], 
  }
]

function Copyright() {
  return (
    <Typography>
      {'Copyright © '}
      <Link>
        Cookies
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function HomePageFooter() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '80%',
          justifyContent: 'space-between',
          mb: 3
        }}
      >
        <Box sx={{minWidth: '60%', display: 'flex', alignItems: 'end'}}>
          <Box sx={{width: '100%', display: 'flex', gap: 1.5, flexDirection: 'column'}}>
            <Box sx={{display: 'flex', gap: 1.5}}>
              <Icon>
                <Box component='img' src={CookieLogo} sx={{width: '100%', height: '100%'}}></Box>
              </Icon>
              <Typography sx={{position: 'relative', top: '1px'}}>Cookies</Typography>
            </Box>
            <Box>
              <Link href="#">
                <Typography sx={{display: 'inline'}}>Privacy Policy</Typography>
              </Link>
              <Typography sx={{display: "inline", ml: 0.5}}>
                &nbsp;•&nbsp;
              </Typography>
              <Link href="#">
                <Typography sx={{display: 'inline'}}>Terms of Service</Typography>
              </Link>
              <Copyright />
            </Box>
          </Box>
        </Box>
        {footerInfo.map((info) => (
          <Box
            key={info.title}
            sx={{
              display: 'flex',
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: "medium" }}>
              {info.title}
            </Typography>
            {info.links.map((link) => (
              <Link key={link} href='#'>
                <Typography>{link}</Typography>
              </Link>
            ))}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: 8,
          mb: 2,
          width: '80%',
          borderTop: '1px solid black'
        }}
      >

      </Box>
    </Box>
  );
}
