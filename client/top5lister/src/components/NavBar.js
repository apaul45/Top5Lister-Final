/* This is the component representing the menu bar with 4 tabs,
a search textfield, and a sort by drop down in the app */
import * as React from 'react';
import { useContext, useState } from 'react';
import AuthContext from '../auth'
import FunctionsIcon from '@mui/icons-material/Functions';
import SortIcon from '@mui/icons-material/Sort';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {useNavigate} from 'react-router-dom'
import {useLocation} from 'react-router-dom'
export default function NavBar(){
    const { auth } = useContext(AuthContext);
    //anchorEL will handle allowing the menu to open or not (initially closed so set to null)
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    //use navigate to navigate to different screens upon pressing the proper button
    const navigate = useNavigate();

    //use location to disable buttons if workspace screen is open
    const location = useLocation();
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    let StyledIconButton = styled(IconButton)({
        '&:hover': {
            border: '2px solid green',
            backgroundColor:"transparent",
            padding:"3px 3px 3px 3px",
            borderRadius: "1px 1px",
          }
    });
    //Add the disabled property if the edit/create screen is open
    if (location.pathname === "/edit"){
        StyledIconButton = styled(IconButton)({
            color:'gray',
            '&:hover': {
                border: '2px solid green',
                backgroundColor:"transparent",
                padding:"3px 3px 3px 3px",
                borderRadius: "1px 1px",
              }
        });
    }

    function handleClick(path){
        //Only allow navigation to other screens if the workspace screen isn't opened
        if (location.pathname !== "/edit"){
            navigate(path);
        }
    }
    //sortMenu will only open if there is an associated anchor element
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
    let navMenu = "";
    //Only allow the nav menu to appear if a guest or a user is viewing the main app
    //ie, remove the menu when a guest tries to go back to the splash screen
    if (auth.type){
        navMenu =
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: '#A19F9F'}}>
                    <StyledIconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2}}
                        onClick = {()=>handleClick("/home")}
                        >
                            <HomeOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}}/>
                    </StyledIconButton>
                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick = {()=>handleClick("/all-lists")}
                    >
                        <GroupsOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick = {()=>handleClick("/persons-lists")}
                    >
                        <PersonOutlinedIcon style={{fill: "black", fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick = {()=>handleClick("/community-lists")}
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