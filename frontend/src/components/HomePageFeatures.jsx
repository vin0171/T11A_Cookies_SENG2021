import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Button, Card, Typography } from '@mui/material';
import { useState } from 'react';
import dummy from '../assets/dummy.jpg';

const items = [
  {
    icon: <DescriptionIcon />,
    title: 'Intuitive Invoice Creation',
    description:
      'Drag and drop xml files',
    image: `url(${dummy})`
  },
  {
    icon: <AssessmentIcon />,
    title: 'Accurate Statistics',
    description:
      'See accurate statistics of all of your created invoices',
    image: `url(${dummy})`
  },
  {
    icon: <SmartToyIcon />,
    title: 'Talk with our AI teller',
    description:
      'you look lonely', 
    image: `url(${dummy})`
  },
];

export default function HomePageFeatures() {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  return (
    <Box sx={{bgcolor: 'aliceblue', pt: 5}}>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box sx={{width: '60%', mb: 2}}>
          <Typography sx={{fontSize: '3em', fontWeight: 'bold'}}>
            What We Offer
          </Typography>
          <Typography sx={{color: 'grey', fontSize: '1.5em'}}>
            Fast Invoice Generation!
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            gap: 2,
            width: '60%'
          }}
        >
          <Box>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, height: '100%'}}>
              {items.map(({ icon, title, description }, index) => (
                <Box
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    p: 2,
                    height: '100%',
                    width: '100%',
                    '&:hover': {
                      backgroundColor: 'grey'
                    },
                    ...selectedItemIndex === index && {
                      backgroundColor: 'action.selected',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'left',
                      gap: 1,
                      color: 'black',
                      textAlign: 'left',
                      textTransform: 'none',
                      ...selectedItemIndex === index && {
                        color: 'black',
                      }
                    }}
                  >
                    {icon}
                    <Typography>{title}</Typography>
                    <Typography>{description}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '70%',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                // REMOVE ML: 0 WHEN YOU'RE ADDING THE REAL IMAGES
                ml: 0,
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: items[selectedItemIndex].image,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
  
}