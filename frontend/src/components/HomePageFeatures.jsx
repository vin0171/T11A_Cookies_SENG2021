import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import dummy from '../assets/dummy.jpg';
import dashboard from '../assets/dashboard.jpg';

const items = [
  {
    icon: <DescriptionIcon sx={{fontSize: "3.5vw"}} />,
    title: 'Intuitive Invoice Creation',
    description: 'Drag and drop XML files.',
    image: `url(${dashboard})`,
  },
  {
    icon: <AssessmentIcon sx={{fontSize: "3.5vw", color: "rgba(46, 173, 30, 0.47)"}} />,
    title: 'Accurate Statistics',
    description: 'View analytics of all your invoices.',
    image: `url(${dashboard})`,
  },
  {
    icon: <SmartToyIcon sx={{fontSize: "3.5vw", color: "rgba(201, 175, 26, 0.81)"}} />,
    title: 'Talk with our AI Teller',
    description: 'Let AI handle your queries.',
    image: `url(${dashboard})`,
  },
  {
    icon: <ReceiptLongIcon sx={{fontSize: "3.5vw", color: "rgba(184, 34, 20, 0.62)"}} /> ,
    title: 'Billing Overview',
    description: 'Manage invoices, payments, and billing history.',
    image: `url(${dashboard})`,

  },
];

export default function HomePageFeatures() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'aliceblue', py: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '60%', mb: 4, textAlign: 'left' }}>
          <Typography sx={{ fontSize: '3em', fontWeight: 'bold' }}>What We Offer</Typography>
          <Typography sx={{ color: 'grey', fontSize: '1.4em' }}>
            Fast, Beautiful Invoice Generation
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'left',
            gap: 4,
            width: '60%',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: '100px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map(({ icon, title, description }, index) => (
              <ButtonBase
                key={index}
                onClick={() => setSelectedItemIndex(index)}
                sx={{
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: 4,
                  px: 10.5,
                  py: 2.5,
                  backgroundColor:
                    selectedItemIndex ===  '#ffffff',
                  boxShadow:
                    selectedItemIndex === index
                      ? '0px 4px 20px rgba(96, 165, 250, 0.3)'
                      : '0px 2px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',

                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7}}>
                  <Box sx={{ color: '#60a5fa' }}>{icon}</Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>{title}</Typography>
                    <Typography sx={{ fontSize: '1em', color: '#555' }}>{description}</Typography>
                  </Box>
                </Box>
              </ButtonBase>
            ))}
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 2,
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: 440,
                height: '100%',
                borderRadius: 4,
                backgroundImage: items[selectedItemIndex].image,
                backgroundSize: 'cover',
                backgroundPosition: `${selectedItemIndex * 25}%`,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transition: 'background-image 0.4s ease',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
