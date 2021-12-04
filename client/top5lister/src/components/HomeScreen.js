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
    if (store.searchField !== ""){
        usersLists = usersLists.filter(list => list.name.toLowerCase().startsWith(store.searchField.toLowerCase()));
    }

    /* Filter the user's lists if a sorting option was chosen */
    if (usersLists.length > 0 && store && store.sortField !== ""){
        const publishedLists = usersLists.filter((list) => list.published.isPublished);
        const savedLists = usersLists.filter((list) => !list.published.isPublished);
        if (store.sortField === "newest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateB-dateA;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            usersLists = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "oldest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateA-dateB;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            usersLists = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "views"){
            usersLists.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            usersLists.sort((a,b) => b.likes.length-a.likes.length);
        }
        else if (store.sortField === "dislikes"){
            usersLists.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }
        else if (store.sortField.includes("name")){
            if (store.sortField.includes("a-z")){
                usersLists.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            }
            else{
                usersLists.sort((a,b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
            }
        }
        else{
            if (store.sortField.includes("a-z")){
                usersLists.sort((a,b) => a.owner.toLowerCase().localeCompare(b.owner.toLowerCase()));
            }
            else{
                usersLists.sort((a,b) => b.owner.toLowerCase().localeCompare(a.owner.toLowerCase()));
            }
        }

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