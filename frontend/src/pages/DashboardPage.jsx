import { Box, Typography } from '@mui/material';
import PresentationCard from '../components/PresentationCard';
import CreatePresentationDialog from '../components/CreatePresentationDialog';
import axios from 'axios';
import { API_URL } from '../App';
import { useEffect, useState } from 'react';
import LoadingBox from '../components/LoadingBox';


/**
 * This page sets up the dashboard page.
 */
export default function DashboardPage({token}) {
  const [presentations, setPresentations] = useState([]);
  const [presentationCreated, setPresentationCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/store`, {headers: {Authorization: `Bearer ${token}`}})
      .then((response) => {
        const presentations = response.data.store.presentations;
        setPresentations(presentations);
        setPresentationCreated(false)
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, [presentationCreated])

  return (
    <>
      <Box component='section' sx={{display: 'grid', gridTemplateRows: '3fr 7fr', height: '100%', overflow:'hidden'}}>
        <Box component='section' 
          sx={{
            bgcolor: '#e2dacd',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <Box 
            sx= {{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '60%',
              gap: '10%',
            }}>
            <Typography 
              variant='h5' 
              sx={{
                color: '#41444d', 
                '@media (max-width: 437px)': {
                  fontSize: '1.25em',
                },
              }}>
              Start a new presentation
            </Typography>
            <CreatePresentationDialog token={token} setPresentationCreated={setPresentationCreated}/>
          </Box>
        </Box>
        <Box 
          component='section' 
          sx={{
            bgcolor: '#6f4e7d',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: '5px',
              bgcolor: '#e2dacd',
            },
          }}>
          <Box sx={{height: '100%', width: '80%', color: 'white'}}>
            <Typography variant= 'h5' sx={{m: '35px 0'}}>Recent Presentations</Typography>
            {loading ? (<LoadingBox progressStyles={{color: 'white'}}/>) : (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                  gap: 2, 
                  pb: '5%',
                  '@media (max-width: 437px)': {
                    gridTemplateColumns: '1fr',
                  },
                }}>
                {presentations.map((p, index) => (
                  <PresentationCard
                    key={index}
                    id={p.id}
                    title={p.title}
                    thumbnail={p.thumbnail}
                    slides={p.slides}
                    description={p.description}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}