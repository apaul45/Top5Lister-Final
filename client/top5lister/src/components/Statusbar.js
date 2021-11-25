import { useContext} from 'react';
import { GlobalStoreContext } from '../store'
import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import {useLocation} from 'react-router-dom'
import AuthContext from '../auth'
import { useNavigate } from 'react-router-dom'
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    let text ="";
    const { store } = useContext(GlobalStoreContext);
    const navigate = useNavigate();

    function handleCreateList(){
        store.createNewList();
        navigate('/edit');
    }
    const{auth} = useContext(AuthContext);
    //Get the location of the app (the current url) using the useLocation hook
    const location = useLocation();
    /*Change what gets rendered for the status bar based on which screen the app is on & 
    other factors (ex: for home, it is also dependent on whether a guest is viewing or not) */
    if (location.pathname === "/home" && auth.type !== "guest"){
        text = <div id="top5-statusbar">
                    <Typography>
                        <IconButton onClick={()=>handleCreateList()}>
                            <AddIcon style={{fontSize:"40pt", color: "black"}}/> 
                        </IconButton>
                    </Typography>
                    Your Lists
               </div> ;
    }
    if (location.pathname === "/edit"){
        text = <div id="top5-statusbar" style={{fontSize:"40pt", color: "gray"}}>
                    <Typography>
                        <IconButton>
                            <AddIcon style={{fontSize:"40pt", color: "gray"}}/> 
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