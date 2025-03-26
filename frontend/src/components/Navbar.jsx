import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import PrestoLogo from './PrestoLogo';

/**
 * This component is the navbar that appears when the user is on any page that 
 * is not the login or register page.
 */
export default function Navbar({children}) {
  const navigate = useNavigate();
  return (
    <Box component='nav' sx={{ flex: 1 }}>
      <AppBar position='static'>
        <Toolbar
          disableGutters
          variant ='dense' 
          sx={{
            bgcolor: '#6f4e7d',
            justifyContent: 'space-between', 
            alignItems: 'center',
            pl: 1.3, 
            pr: 1.3,
            minHeight: 75
          }}>
          <PrestoLogo
            styles={{	
              fontSize: '1.5em', 
              width: 110,
              '&:hover': {
                cursor: 'pointer'
              },
            }}
            handleClick={() => {navigate('/')}}
          />
          {children}
        </Toolbar>
      </AppBar>
    </Box>
  );
}