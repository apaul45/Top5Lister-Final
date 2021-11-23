import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import {useLocation} from 'react-router-dom'
import { useContext } from 'react';
import AuthContext from '../auth'
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    let text ="";
    const{auth} = useContext(AuthContext);
    //Get the location of the app (the current url) using the useLocation hook
    const location = useLocation();
    //Change what gets rendered for the status bar based on which screen the app is on
    if (location.pathname === "/home" && auth.type !== "guest"){
        text = <div id="top5-statusbar">
                    <Typography>
                        <IconButton>
                            <AddIcon style={{fontSize:"40pt", color: "black"}}/> 
                        </IconButton>
                    </Typography>
                    Your Lists
               </div> ;
    }
    return(
        text
    );
}

export default Statusbar;