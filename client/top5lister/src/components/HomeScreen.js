import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
export default function HomeScreen(){
    const {store} = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    useEffect(() => {
        store.loadLists();
    }, []);

    let usersLists = [];

    if (auth.user){
        //Home Screen should only contain the signed in user's lists
        usersLists = store.lists.filter(list => list.owner == auth.user.username);

    }
    //Filter the user's lists if there's something in the search bar
    //NOTE: Only for HomeScreen, the search field should return results that
    //START WITH the search query
    if (store && store.searchField !== ""){
        usersLists = store.filterBySearch(usersLists, "home");
    }

    /* Filter the user's lists if a sorting option was chosen */
    if (usersLists.length > 0 && store && store.sortField !== ""){
        usersLists = store.sortList(usersLists);
    }
    return (
            <div className="background-screen" style={{overflow: "auto"}}>
                <List sx={{ width: '96.8%', left: '1.6%'}}
                style={{maxHeight: '140%', overflow: 'auto'}}
                >
                {
                    usersLists.map(list =>
                        <ListCard 
                        key={list._id}
                        list={list} />)
                }
                </List>
        </div>);
}