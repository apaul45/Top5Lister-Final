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


    /* Filter the user's lists if a sorting option was chosen, and 
    then set the sort field in store to null */
    if (store && store.sortField !== ""){
        if (store.sortField === "newest"){
            searchedLists.current.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateB-dateA;
            });
        }
        else if (store.sortField === "oldest"){
            searchedLists.current.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateA-dateB;
            });
        }
        else if (store.sortField === "views"){
            console.log(searchedLists);
            searchedLists.current.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            searchedLists.current.sort((a,b) => b.likes.length-a.likes.length);
        }
        else{
            searchedLists.current.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }

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