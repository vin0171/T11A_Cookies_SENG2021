import { Button } from "@mui/material";

export default function DefaultButton({type='', name}) {
  return (
    <Button 
      type={type} 
      sx={{
        padding: '1.3em 3em',
        fontSize: '1em',
        letterSpacing: '1px',
        textTransform: 'none',
        fontWeight: 'bold',
        height: '60px',
        width: '150px',
        color: 'white',
        bgcolor: 'black',
        border: 'none',
        borderRadius: '45px',
        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease 0s',
        cursor: 'pointer',
        outline: 'mone',
        '&:hover': {
          bgcolor: 'cornflowerblue',
          boxShadow: '0px 15px 20px rgba(52, 107, 202, 0.84)',
          color: 'black',
          transform: 'translateY(-7px)',
        },
        '&:active': {
          transform: 'translateY(-1px)'
        }
        
      }}
    > 
      {name}
    </Button>
  )
}