import { Box, Button, Typography } from '@mui/material';
import PresentationCard from '../components/PresentationCard';
import RegisterCompanyDialog from '../components/RegisterCompanyDialog'
import { useEffect, useState } from 'react';
import LoadingBox from '../components/LoadingBox';
import axios from 'axios';
import { API_URL } from '../App';
import { useNavigate } from 'react-router-dom';


/**
 * This page sets up the dashboard page.
 */
export default function DashboardPage({token}) {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState([]);
  const [companyCreated, setCompanyCreated] = useState(false);
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(true);
  const registerButton = loading
  ? null
  : companyCreated
    ? <Box 
      sx= {{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
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
        Create an Invoice
      </Typography>
      <Button 
        variant='contained' 
        onClick={() => navigate(`/${companyCreated}/invoices/create`)}
        sx={{
          bgcolor: '#9ccde1', 
          height: 50,
          width: 200,
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '1.5em',
        }}
      >
        Create
      </Button>
      </Box>
    : <Box 
      sx= {{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
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
        Register a Company
      </Typography>
      <RegisterCompanyDialog token={token} setCompanyCreated={setCompanyCreated}/>
      </Box>;

  useEffect(() => {
    setLoading(true)
    axios.get(`${API_URL}/v1/user/details`, {headers: {Authorization: `Bearer ${token}`}})
    .then((response) => {
      setCompanyCreated(response.data.companyId)
      setLoading(false)
    }).catch(error => console.log(error.response.data.error));
  }, [])

  useEffect(() => {
    if (companyCreated) {
      setLoading(true)
      axios.get(`${API_URL}/v1/company/${companyCreated}/invoices`, {headers: {Authorization: `Bearer ${token}`}})
      .then((response) => {
        setInvoices(response.data)
        setLoading(false)
      })      
    }
  },[companyCreated])

  return (
    <>
      <Box component='section' sx={{display: 'grid', gridTemplateRows: '3fr 7fr', height: '100%', overflow:'hidden'}}>
        <Box component='section' 
          sx={{
            bgcolor: '#e2dacd',
            display: 'flex',
            justifyContent: 'center'
          }}>
        {registerButton}
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
            <Typography variant= 'h5' sx={{m: '35px 0'}}>Recent Invoices</Typography>
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