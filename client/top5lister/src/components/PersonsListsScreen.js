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

    if (searchedLists.current.length > 0 && store.lists && location.pathname === '/persons-lists'){
        searchedLists.current = store.lists.filter(list => {
        
            if(list.owner.toLowerCase() === store.searchField.toLowerCase()){
                if (auth.user){
                    //Make sure it is case insensitive
                    if (auth.user.username.toLowerCase() === store.searchField.toLowerCase()){
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
    if (searchedLists.current.length > 0 && store && store.sortField !== ""){
        const publishedLists = searchedLists.current.filter((list) => list.published.isPublished);
        const savedLists = searchedLists.current.filter((list) => !list.published.isPublished);
        if (store.sortField === "newest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateB-dateA;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            searchedLists.current = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "oldest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateA-dateB;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            searchedLists.current = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "views"){
            console.log(searchedLists);
            searchedLists.current.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            searchedLists.current.sort((a,b) => b.likes.length-a.likes.length);
        }
        else if (store.sortField === "dislikes"){
            searchedLists.current.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }
        else if (store.sortField.includes("name")){
            if (store.sortField.includes("a-z")){
                searchedLists.current.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            }
            else{
                searchedLists.current.sort((a,b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
            }
        }
        else{
            if (store.sortField.includes("a-z")){
                searchedLists.current.sort((a,b) => a.owner.toLowerCase().localeCompare(b.owner.toLowerCase()));
            }
            else{
                searchedLists.current.sort((a,b) => b.owner.toLowerCase().localeCompare(a.owner.toLowerCase()));
            }
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