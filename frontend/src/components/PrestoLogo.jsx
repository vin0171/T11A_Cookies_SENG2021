import Typography from '@mui/material/Typography';

/**
 * This component renders the skeleton for the Presto logo (i.e its background colour and text).
 * If this component is used it should have a width, height and added customisations added.
 */
export default function PrestoLogo({styles = {}, handleClick={}}) {
  return (
    <Typography
      noWrap
      component='h3'
      onClick={handleClick}
      sx={{	
        bgcolor: '#553b5f',
        textAlign: 'center',
        p: 1,
        pl: 1.5,
        pr: 1.5,
        borderRadius: 2,
        fontWeight: 'bold',
        letterSpacing: 1,
        '&:hover': {
          cursor: 'default'
        },
        ...styles
      }}>
    Presto	
    </Typography>
  )
}