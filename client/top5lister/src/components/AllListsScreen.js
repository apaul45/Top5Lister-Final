/* This screen displays all lists in the current database */
import React, { useContext, useEffect, useRef } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import List from '@mui/material/List';
import {useLocation} from 'react-router-dom'
import AuthContext from '../auth'
export default function AllListsScreen(){
    /* All the code below is the exact same as that in PersonsListScreen, but 
    made so that searchedLists contains all lists on default 
    (essentially a hybrid of HomeScreen and PersonsListsScreen) */
    const {store} = useContext(GlobalStoreContext);
    const{auth} = useContext(AuthContext);

    useEffect(() => {
        store.loadLists();
    }, []);

    //Initialize searchedLists to store.lists 
    let searchedLists = useRef(store.lists);

    if (store.searchField !== "" && store.lists){
        searchedLists.current = store.filterBySearch(searchedLists.current, "all-lists");
    }

    /* Filter the user's lists if a sorting option was chosen */
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
                    {console.log(searchedLists)}
            </List>
        </div>
    )
};