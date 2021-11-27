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
    if (store.searchField !== ""){
        usersLists = usersLists.filter(list => list.name === store.searchField);
    }

    /* Filter the user's lists if a sorting option was chosen, and 
    then set the sort field in store to null */
    if (store && store.sortField !== ""){
        if (store.sortField === "newest"){
            usersLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateB-dateA;
            });
        }
        else if (store.sortField === "oldest"){
            usersLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateA-dateB;
            });
        }
        else if (store.sortField === "views"){

            usersLists.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            usersLists.sort((a,b) => b.likes.length-a.likes.length);
        }
        else{
            usersLists.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }

    }
    return (
            <div className="background-screen">
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