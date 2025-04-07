import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import PrestoLogo from './PrestoLogo';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect, useState } from 'react';
import {  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

/**
 * This component is the navbar that appears when the user is on any page that 
 * is not the login or register page.
 */
export default function Navbar({token, loggedIn, children}) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = (newOpen) => () => {
    setOpenMenu(newOpen)
  }

  useEffect(() => {
    // use the token to grab the users id and then fetch their details
  }, [token])

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleMenu(false)}>
      <List>
        {['Stats', 'AI Chat'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate('/')}> 
              <ListItemIcon>
                {text === 'Stats' && 
                  <QueryStatsIcon fontSize='large' sx={{ color: '#27548A'}}/>
                }
                {text === 'AI Chat' && 
                  <SmartToyIcon fontSize='large' sx={{ color: '#27548A'}}/>
                }
              </ListItemIcon>
              <ListItemText  
                slotProps={{
                  primary: {
                    style: { fontSize: '1.5em' }
                  }
                }}
                primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  let toolbarComponent =  
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

  if (loggedIn) { 
    toolbarComponent = 
    <Box sx={{display: 'flex'}}>
      <IconButton
        size='large'
        edge='start'
        color='inherit'
        aria-label='menu'
        sx={{ mr: 2, p: 0, ml: 0.1 }}
        onClick={toggleMenu(true)}
      >
        <MenuIcon fontSize='large'/>
      </IconButton>
      <Drawer 
        open={openMenu} 
        onClose={toggleMenu(false)}
        slotProps = {{
          paper: {
            sx: {
              bgcolor: '#e2dacd'
            }
          }
        }}
      >
        {DrawerList}
      </Drawer>
      {toolbarComponent}
    </Box>
  }


  return (
    <Box component='nav' sx={{ flex: 1 }}>
      <AppBar position='static'>
        <Toolbar
          disableGutters
          variant ='dense' 
          sx={{
            bgcolor: '#27548A',
            justifyContent: 'space-between', 
            alignItems: 'center',
            pl: 1.3, 
            pr: 1.3,
            minHeight: 75
          }}>
          {toolbarComponent}
          {children}
        </Toolbar>
      </AppBar>
    </Box>
  );
}