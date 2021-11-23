import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
export default function HomeScreen(){
    const {store} = useContext(GlobalStoreContext);
    let newArray = [2,1];
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '96.8%', left: '1.6%'}}>
            {   
                newArray.map((i)=>
                <ListCard
                    />
                )
            }
            </List>;
    }
    return (
            <div id="home-screen">
                {
                    listCard
                }
        </div>);
}