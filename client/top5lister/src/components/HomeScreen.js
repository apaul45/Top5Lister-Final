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
 
    return (
            <div className="background-screen">
<<<<<<< HEAD
                <List sx={{ width: '96.8%', left: '1.6%'}}
                style={{maxHeight: '100%', overflow: 'auto'}}
                >
=======
>>>>>>> a2787e57d84d30cc036d543b1e6debb33d0ce7e7
                {
                    usersLists.map(list =>
                        <ListCard 
                        key={list._id}
                        list={list} />)
                }
                </List>
        </div>);
}