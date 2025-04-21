import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 4,
        pb: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        bgcolor: 'aliceblue',
      }}
    >
      <Box sx={{ width: '60%', textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold">
          Pricing
        </Typography>
        <Typography variant="h6">Check out our plans</Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 6,
          width: '90%',
          margin: '0auto'
        }}
      >
        {tiers.map((tier) => {
          const isHighlighted = tier.title === 'Professional';
          return (
            <Box
              key={tier.title}
              sx={{
                width: '100%',
                maxWidth: 440,
                transform: isHighlighted ? 'scale(1.05)' : 'none',
                transition: 'transform 0.3s',
              }}
              
            >
              <Card
                sx={{
                  p: 3,
                  minHeight: 580,
                  bgcolor: isHighlighted ? theme.palette.primary.main : '#f5faff',
                  color: isHighlighted ? 'white' : 'black',
                  borderRadius: '16px',
                  boxShadow: isHighlighted
                    ? '0 12px 24px rgba(0,0,0,0.2)'
                    : '0 8px 16px rgba(0,0,0,0.05)',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 1,
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      {tier.title}
                    </Typography>

                    {tier.subheader && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={tier.subheader}
                        sx={{
                          color: isHighlighted ? 'white' : theme.palette.primary.main,
                          backgroundColor: isHighlighted
                            ? 'rgba(255,255,255,0.2)'
                            : 'rgba(96,165,250,0.15)',
                          '& .MuiChip-icon': {
                            color: isHighlighted ? 'white' : theme.palette.primary.main,
                          },
                        }}
                      />
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold">
                      ${tier.price}
                    </Typography>
                    <Typography variant="body1">&nbsp;per month</Typography>
                  </Box>

                  <Divider
                    sx={{
                      my: 2,
                      borderColor: isHighlighted ? 'white' : '#ccc',
                      opacity: 0.8,
                    }}
                  />

                  {tier.description.map((line) => (
                    <Box
                      key={line}
                      sx={{
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize: 20,
                          color: isHighlighted ? 'white' : theme.palette.primary.main,
                        }}
                      />
                      <Typography>{line}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
