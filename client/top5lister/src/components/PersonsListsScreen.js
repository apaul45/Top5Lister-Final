/* This screen displays the lists of the user searched 
for in the search bar */
import React, { useContext, useEffect, useRef } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List';
import {useLocation} from 'react-router-dom'
import AuthContext from '../auth'
export default function PersonsListsScreen(){
    const {store} = useContext(GlobalStoreContext);
    const{auth} = useContext(AuthContext);
    const location = useLocation();
    let searchedLists = useRef([]);

    useEffect(() => {
        store.loadLists();
    }, []);

    if (store.lists && location.pathname === '/persons-lists'){
        searchedLists.current = store.filterBySearch(searchedLists.current, "user-lists");
    }


    /* Filter the user's lists if a sorting option was chosen, and 
    then set the sort field in store to null */
    if (searchedLists.current.length > 0 && store && store.sortField !== ""){
        searchedLists.current = store.sortList(searchedLists.current);
    }

    return(
        <div className="background-screen" style={{overflow: "auto"}}> 
            <List sx={{ width: '96.8%', left: '1.6%'}}
            style={{maxHeight: '100%', overflow: 'auto'}}
            >
                {searchedLists.current.map(list => 
                    <ListCard 
                    key={list._id}
                    list={list} />)}
            </List>
        </div>
    )
};