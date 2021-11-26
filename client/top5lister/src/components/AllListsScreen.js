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
        searchedLists.current = store.lists.filter(list => {
            if(list.name === store.searchField){
                if (auth.user){
                    /* If the list is the user's list, then also 
                    allow their saved, unpublished ones to appear */
                    if (auth.user.username === list.owner){
                        return list;
                    }
                    else{
                        if (list.published.isPublished){
                            return list;
                        }
                    }
                }
                else{
                    if (list.published.isPublished){
                        return list;
                    }
                }
            }
        });
    }
    /* Make sure all published lists are part of what gets shown on this screen
    (this is so that guests can also view and search for specific things) */
    else if (store.lists && auth.type){
        /* Only allow the user's saved lists to appear: everyone else's lists
        that appear on this screen should be published */
        searchedLists.current = store.lists.filter(list => {
            if (auth.user && auth.user.username === list.owner){
                return list;
            }
            else{
                if (list.published.isPublished){
                    return list;
                }
            }
        });
    }

    return(
        <div className="background-screen"> 
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