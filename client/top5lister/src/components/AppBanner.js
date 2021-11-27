import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleMenuClose = () => {
        setAnchorEl(null);
        /*use auth.checkLoggedIn to remove the second nav bar if
        a guest presses it */
        auth.checkLoggedIn();
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
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
            <Link to='/register'><MenuItem onClick={handleMenuClose}>Create New Account</MenuItem></Link>
            <Link to='/login'><MenuItem onClick={handleMenuClose}>Login</MenuItem></Link>
        </Menu>
    );
    const loggedInMenu = 
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        
    let menu = loggedOutMenu;
    //Only make the menu the logged in menu if the user is logged in
    if (auth.user){
        menu = loggedInMenu;
    }
    function getAccountMenu(loggedIn) {
        //IF USER IS LOGGED IN, THEN DISPLAY USER INITIALS
        if (loggedIn){
            if (auth.user){
                return <div id="userCircle">
                    {auth.user.firstName.substring(0,1) + auth.user.lastName.substring(0,1)}
                </div>;
            }
        }
        ////Account circle is the icon that apppears on the top right of the default screen
        return <AccountCircle style={{fill: "black", fontSize:"40px", float: "right"}}/>;
    }
    //Only make the button enabled if a guest is currently viewing the site
    let splashScreenButton = <div style={{  
    color: '#a68d0e', fontSize:"45px" }} >T<sup>5</sup>L</div>;
    if (auth.type !== "user"){
        splashScreenButton = <Link
        onClick={()=>auth.checkLoggedIn()} to='/'
        style={{textDecoration: 'none'}}>
            {splashScreenButton}
        </Link>
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar style={{backgroundColor: '#BFBBBB'}}>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}                        
                    >
                        {splashScreenButton}
                    </Typography>
                    {/*This is the code for the user icon button: when this is pressed, create new account & login buttons should be shown*/}
                    {/* When user is logged in, then getAccMenu will display initials, else it will display the AccountCircle */}
                    <Box sx={{ display: { xs: 'none', md: 'flex', marginLeft: 'auto'} }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}