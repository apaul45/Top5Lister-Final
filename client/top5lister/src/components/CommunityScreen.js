/* This screen displays all the community aggregate lists */
import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import ListCard from './ListCard.js'
export default function CommunityScreen(){
    const {store} = useContext(GlobalStoreContext);
    
    /* namesTable will map each unique list name to the list of lists 
    that have that name */
    let namesTable = new Map();
    let aggregateLists = [];

    if (store.lists){
        /* For each list, map it to namesTable */
        store.lists.map(list => {
            const lowercase = list.name.toLowerCase();
            if (namesTable.has(lowercase) && list.published.isPublished){
                let mappedList = [...namesTable.get(lowercase), list.items];
                namesTable.set(lowercase, mappedList);
            }
            else{
                if (list.published.isPublished){
                    let mappedList = [list.items];
                    namesTable.set(lowercase, mappedList);
                }
            }
        });

        namesTable.forEach((value, name) => {
            let aggregateList = {
                name: name,
                items: [],
                comments: [],
                likes: 0,
                dislikes: 0, 
                views: 0,
                created: new Date(),
            };
            //Rankings will map each unique item name to the number of votes it got
            let rankings = [];
            //Go through each list and map items to their votes
            value.forEach(list => {
                for (let i = 0; i<5; i++){
                    let itemName = list[i].toLowerCase();
                    const index = rankings.findIndex(item => item.name === itemName);
                    if (index !== -1){
                        //If rankings already includes this object, then
                        //update votes as i+1
                        rankings[index].votes += (5-i);
                    }
                    else{
                        rankings.push({name: itemName, votes: 5-i});
                    }
                }
            });
            //Sort rankings, and return the 5 highest items in terms of votes
            aggregateList.items = rankings.sort((a,b) => b.votes - a.votes)
                                  .slice(0,5);
            aggregateLists.push(aggregateList);
        });    
        console.log(aggregateLists); 
    }
    return(
        <div className="background-screen"> 

        </div>
    )
};