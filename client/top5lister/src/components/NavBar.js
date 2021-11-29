/* This is the component representing the menu bar with 4 tabs,
a search textfield, and a sort by drop down in the app */
import * as React from 'react';
import { useContext, useState } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
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
    const {store} = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    let disabled = false;
    //anchorEL will handle allowing the menu to open or not (initially closed so set to null)
    const [anchorEl, setAnchorEl] = useState(null);
    let isMenuOpen = Boolean(anchorEl);

    //use navigate to navigate to different screens upon pressing the proper button
    const navigate = useNavigate();

    //use location to disable buttons if workspace screen is open
    const location = useLocation();

    let StyledIconButton = styled(IconButton)({
        color: "black",
        '&:hover': {
            border: '2px solid green',
            backgroundColor:"transparent",
            padding:"3px 3px 3px 3px",
            borderRadius: "1px 1px",
          },
        '&:active':{
            border: '2px solid green',
            backgroundColor:"transparent",
            padding:"3px 3px 3px 3px",
            borderRadius: "1px 1px",
        }
    });
    //Add the disabled property if the edit/create screen is open
    if (location.pathname === "/edit"){
        disabled = true;
    }

    function handleClick(path){
        //Only allow navigation to other screens if the workspace screen isn't opened
        if (location.pathname !== "/edit"){
            if (location.pathname !== path){
                store.setSortField("");
            }
            navigate(path);
            disabled = false;
        }
    }

    function handleMenuItemClick(sortParam){
        store.setSortField(sortParam);
        setAnchorEl(null);
    }
    const handleProfileMenuOpen = (event) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
    }
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const menuId = 'primary-search-account-menu';
    //sortMenu will only open if there is an associated anchor element
    const sortMenu = (
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
    >
        <MenuItem onClick={()=>handleMenuItemClick("newest")}>Publish Date (Newest)</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("oldest")}>Publish Date (Oldest)</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("views")}>Views</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("likes")}>Likes</MenuItem>
        <MenuItem onClick={()=>handleMenuItemClick("dislikes")}>Dislikes</MenuItem>
    </Menu>);


    let navMenu = "";
    //Only allow the nav menu to appear if a guest or a user is viewing the main app
    //ie, remove the menu when a guest tries to go back to the splash screen
    if (auth.type){
        navMenu =
        (<Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: '#A19F9F'}}>
                    <StyledIconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2}}
                        disabled={disabled}
                        onClick = {()=>handleClick("/home")}
                        >
                            <HomeOutlinedIcon style={{fontSize:"45px", float: "right"}}/>
                    </StyledIconButton>
                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    disabled={disabled}
                    onClick = {()=>handleClick("/all-lists")}
                    >
                        <GroupsOutlinedIcon style={{fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    disabled={disabled}
                    onClick = {()=>handleClick("/persons-lists")}
                    >
                        <PersonOutlinedIcon style={{fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    disabled={disabled}
                    onClick = {()=>handleClick("/community-lists")}
                    >
                        <FunctionsIcon style={{fontSize:"45px", float: "right"}} />
                    </StyledIconButton>

                    <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '75ch', backgroundColor: "white" },
                    }}
                    disabled={disabled}
                    noValidate
                    autoComplete="off"
                    >
                        <TextField id="outlined-basic" label={store.searchField?"" : "Search"} disabled={disabled} 
                        variant="outlined"
                        defaultValue={store ? store.searchField : ""}
                        onKeyPress={event => store.updateSearchField("keypress", event)}
                        onChange={event => store.updateSearchField("change",event)}/>
                    </Box>
                    <strong style={{color: "black", position: "relative", 
                    right:"-340px", size:"45px"}}>
                            SORT BY
                        </strong>
                    <Box sx={{ display: {md: 'flex', marginLeft: 'auto'} }}>
                        <StyledIconButton
                            size="large"
                            edge="end"
                            disabled={disabled}
                            aria-label="sort-button"
                            aria-haspopup="true"
                            aria-controls={menuId}
                            onClick={handleProfileMenuOpen}
                        >
                            <SortIcon 
                            style={{fontSize:"45px"}}
                            />
                        </StyledIconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {sortMenu}
        </Box>);
    }
    return (
        navMenu
    );
}