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
        searchedLists.current = store.lists.filter(list => {
        
            if(list.owner === store.searchField){
                if (auth.user){
                    if (auth.user.username === store.searchField){
                        return list;
                    }
                    else{
                        if (list.isPublished){
                            return list;
                        }
                    }
                }
                else{
                    if (list.isPublished){
                        return list;
                    }
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