import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Returns a grey box if the presentation thumbnail wasn't set, and the thumbnail otherwise.
const PresentationThumbnail = ({thumbnail}) => { 
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
      alt='Presentation Thumbnail'
    />
  )
}

/**
 * This component sets up presentation cards which appear on the dashboard.
 */
export default function PresentationCard({id, title, thumbnail, slides, description}) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/presentation/${id}/0`)
  }

  return (
    <Card onClick={handleClick} sx={{bgcolor: '#e2dacd', aspectRatio: '2/1', cursor:'pointer'}}>
      <PresentationThumbnail thumbnail={thumbnail} />
      <CardContent>
        <Typography component='h5' sx={{fontSize: '1.25em'}}>
          {title}
        </Typography>
        <Typography component='h6'>
          {slides.length <= 1 ? '1 Slide' : `${slides.length} Slides`}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary'}}>
          {description}
        </Typography>
      </CardContent>
    </Card>  
  )
}

