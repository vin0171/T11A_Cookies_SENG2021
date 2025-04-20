import { Box, Typography, Card, CardContent, Divider, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      'Up to 3 invoices/month',
      'Basic invoice templates',
      'Email support',
      'Access to dashboard',
    ],
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    price: '5',
    description: [
      'Unlimited invoices',
      'Custom invoice branding',
      'Automated email reminders',
      'Payment tracking & status updates',
      'Export as PDF/CSV',
      'Priority email support',
    ],
  },
  {
    title: 'Enterprise',
    price: '10',
    description: [
      'Everything in Professional',
      'Multi-user access',
      'Role-based permissions',
      'Custom domain & white-labeling',
      'API access & Webhooks',
      'Dedicated account manager',
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
      <Box sx={{ width: '60%', textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '3em' }}>Pricing</Typography>
        <Typography sx={{ fontSize: '1.5em' }}>
          Check out our plans
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr'
          },
          gap: 6,
          width: '90%',
          justifyContent: 'center'
        }}
      >
        {tiers.map((tier) => (
          <Box sx={{ width: '100%', maxWidth: 350 }} key={tier.title}>
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4,
                bgcolor: tier.title === 'Professional'
                  ? '#60a5fa'
                  : '#e8f1fc',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                minHeight: 580,
                color: tier.title === 'Professional' ? 'white' : 'black',
              }}
            >

              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1,
                    ...(tier.title === 'Professional'
                      ? { color: 'white' }
                      : { color: 'black' }
                    )
                  }}
                >
                  <Typography sx={{ fontSize: '2em', fontWeight: 700 }}>
                    {tier.title}
                  </Typography>
                  {tier.title === 'Professional' && (
                    <Chip
                      sx={{
                        color: 'white',
                        '& .MuiChip-icon': {
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
                    ...(tier.title === 'Professional' && { color: 'e8f1fc' })
                  }}
                >
                  <Typography sx={{ fontSize: '3em', fontWeight: 600 }}>
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
  );
}
