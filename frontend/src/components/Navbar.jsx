import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate } from 'react-router-dom';
import CookieLogo from './CookieLogo';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useEffect, useState } from 'react';
import {  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';

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

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleMenu(false)}>
      <List>
      {['Stats', 'AI Chat', 'Customers', 'Invoices', 'Items'].map((text) => (
        <ListItem key={text} disablePadding>
          <ListItemButton onClick={() => navigate(`/${text.toLowerCase()}`)}>
            <ListItemIcon>
              {text === 'Stats' && <QueryStatsIcon fontSize='large' sx={{ color: '#27548A' }}/>}
              {text === 'AI Chat' && <SmartToyIcon fontSize='large' sx={{ color: '#27548A' }}/>}
              {text === 'Customers' && <PeopleAltIcon fontSize='large' sx={{ color: '#27548A' }}/>}
              {text === 'Invoices' && <DescriptionIcon fontSize='large' sx={{ color: '#27548A' }}/>}
              {text === 'Items' && <InventoryIcon fontSize='large' sx={{ color: '#27548A' }}/>}
            </ListItemIcon>
            <ListItemText primary={text} sx={{ '& span': { fontSize: '1.5em' } }} />
          </ListItemButton>
        </ListItem>
      ))}
      </List>
    </Box>
  );

  let toolbarComponent =  
  <CookieLogo
    styles={{	
      fontSize: '1.5em', 
      width: 110,
      '&:hover': {
        cursor: 'pointer'
      },
    }}
    handleClick={() => {navigate('/')}}
  />

  let navStyle = 
  <>
  
  
  </>


  if (loggedIn) { 
    toolbarComponent = 
    <Box sx={{display: 'flex'}}>
      <IconButton
        size='large'
        edge='start'
        color='inherit'
        aria-label='menu'
        sx={{ mr: 2, p: 0, ml: 0.1}}
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
    <Box component='nav'>
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