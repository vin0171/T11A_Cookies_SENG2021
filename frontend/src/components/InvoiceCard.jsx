import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Returns a grey box if the invoice thumbnail wasn't set, and the thumbnail otherwise.
const InvoiceThumbnail = ({thumbnail}) => { 
  if (!thumbnail) {
    return (
      <Box sx={{bgcolor: 'grey', width: '100%', height: '40%'}}></Box>
    )
  }
  return (
    <CardMedia
      component='img'
      sx={{height: '40%'}}
      src={thumbnail}
      alt='Invoice Thumbnail'
    />
  )
}

/**
 * This component sets up invoice cards which appear on the dashboard.
 */
export default function InvoiceCard({company, title, invoiceId, thumbnail}) {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/${company}/invoices/${invoiceId}/create`);
  
  return (
    <Card onClick={handleClick} sx={{bgcolor: '#e2dacd', aspectRatio: '2/1', cursor:'pointer'}}>
      <InvoiceThumbnail thumbnail={thumbnail} />
      <CardContent>
        <Typography component='h5' sx={{fontSize: '1.25em'}}>
          {title}
        </Typography>
        {/* <Typography component='h6'>
          {slides.length <= 1 ? '1 Slide' : `${slides.length} Slides`}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary'}}>
          {description}
        </Typography> */}
      </CardContent>
    </Card>  
  )
}

