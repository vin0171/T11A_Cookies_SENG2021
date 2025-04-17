import { Box, Grid2, Typography, Button, Card, CardActions, CardContent, Divider, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      'Free benefit 1',
      'Free benefit 2'
    ],
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    price: '5',
    description: [
      'Professional benefit 1',
      'Professional benefit 2',
      'Professional benefit 3',
      'Professional benefit 4',
      'Professional benefit 5',
      'Professional benefit 6',
    ],
  },
  {
    title: 'Enterprise',
    price: '10',
    description: [
      'Enterprise benefit 1',
      'Enterprise benefit 2',
    ],
  },
];

export default function HomePagePricing() {
  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        bgcolor: 'aliceblue'
      }}
    >
      <Box sx={{width: '60%', textAlign: 'center'}}>
        <Typography sx={{fontWeight:'bold', fontSize: '3em'}}>Pricing</Typography>
        <Typography sx={{fontSize: '1.5em'}}>
          Check out our plans
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          width: '80%', 
          gap: 10
        }}
      >
        {tiers.map((tier) => (
          <Box sx={{width: '100%'}} key={tier.title}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border:'2px solid black',
                bgcolor: 'cornflowerblue',
                ...(tier.title === 'Professional' && {
                  background:
                    'radial-gradient(circle at 50% 0%, hsl(221, 100.00%, 74.30%), hsl(224, 49.50%, 36.50%))',
                  boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                })
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    ...(tier.title === 'Professional'
                      ? { color: 'white'}
                      : {color: 'black'}
                    )
                  }}
                >
                  <Typography sx={{fontSize: '2em',}}>
                    {tier.title}
                  </Typography>
                  {tier.title === 'Professional' && (
                    <Chip 
                      sx={{
                        color: 'white',
                        '& .MuiChip-icon' : {
                          color: 'white'
                        }
                      }} 
                      icon={<AutoAwesomeIcon />} 
                      label={tier.subheader} 
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    ...(tier.title === 'Professional' && {color: 'white'})
                  }}
                >
                  <Typography sx={{fontSize : '3em'}}>
                    ${tier.price}
                  </Typography>
                  <Typography>
                    &nbsp; per month
                  </Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'black' }} />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        ...(tier.title === 'Professional'
                          ? { color: 'white' }
                          : { color: 'black' })
                      }}
                    />
                    <Typography
                      sx={{
                        ...(tier.title === 'Professional'
                          ? { color: 'white' }
                          : { color: 'black' })
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  )
}