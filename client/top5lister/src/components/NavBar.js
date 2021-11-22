/* This is the component representing the menu bar with 4 tabs,
a search textfield, and a sort by drop down in the app */
import * as React from 'react';
import { useContext, useState } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import FunctionsIcon from '@mui/icons-material/Functions';
//import SearchIcon from '@mui/icons-material/SearchIcon';
import SortIcon from '@mui/icons-material/Sort';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
export default function NavBar(){
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const StyledIconButton = styled(IconButton)({
        '&:hover': {
            border: '2px solid green',
            backgroundColor:"transparent",
            padding:"3px 3px 3px 3px",
            borderRadius: "1px 1px",
          }
    });
    const sortMenu = 
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
        }}
        MenuListProps={{
            'aria-labelledby': 'sort-button',
          }}
        open={isMenuOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={handleMenuClose}>Publish Date (Newest)</MenuItem>
        <MenuItem onClick={handleMenuClose}>Publish Date (Oldest)</MenuItem>
        <MenuItem onClick={handleMenuClose}>Views</MenuItem>
        <MenuItem onClick={handleMenuClose}>Likes</MenuItem>
        <MenuItem onClick={handleMenuClose}>Dislikes</MenuItem>
    </Menu> 
    // const StyledTextField = styled((TextField)({
    //       border: '0px solid white',
    //       overflow: 'hidden',
    //       borderRadius: 1,
    //       '&:hover': {
    //         border: '0px solid white'
    //       },
    //   }));
    let navMenu = "";
    //Only allow the nav menu to appear if a guest or a user is viewing the main app
    //ie, remove the menu when a guest tries to go back to the splash screen
    if (auth.type){
        navMenu =
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: '#A19F9F'}}>
                    <Link to="/home">
                        <StyledIconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2}}
                        >
                            <HomeOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}}/>
                        </StyledIconButton>
                    </Link>
                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    >
                        <GroupsOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    >
                        <PersonOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    >
                        <FunctionsIcon style={{fill: "black", fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '75ch', backgroundColor: "white" },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField id="outlined-basic" label="Search" variant="outlined"/>
                    </Box>
                    <strong style={{color: "black", position: "relative", right:"-340px", size:"45px"}}>
                        SORT BY
                    </strong>
                    <Box sx={{ display: { xs: 'none', md: 'flex', marginLeft: 'auto'} }}>
                        <StyledIconButton
                            size="large"
                            edge="end"
                            aria-label="sort-button"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen ? 'true' : undefined}
                            onClick={handleProfileMenuOpen}
                        >
                            <SortIcon style={{fontSize:"45px", color: "black"}}/>
                        </StyledIconButton>
                    </Box>
                </Toolbar>
                {sortMenu}
            </AppBar>
        </Box>
    }
    return (
        navMenu
    );
}