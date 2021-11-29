/* This screen displays all the community aggregate lists */
import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AggregateListCard from './AggregateListCard.js'
import List from '@mui/material/List';
require('@gouch/to-title-case');

export default function CommunityScreen(){
    const {store} = useContext(GlobalStoreContext);
    
    useEffect(() => {
        store.loadLists();
    }, []);
    /* namesTable will map each unique list name to the list of lists 
    that have that name */
    let namesTable = new Map();
    let aggregateLists = [];

    if (store.lists){
        /* For each list, map it to namesTable */
        store.lists.map(list => {
            const lowercase = list.name.toLowerCase();
            //Make sure not to add the existing aggregate lists to the namesTable
            if (list.owner !== "community-aggregate"){
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
            }
        });

        namesTable.forEach((value, name) => {
            let aggregateList = {
                name: name,
                items: [],
                owner: "community-aggregate",
                comments: [],
                likes: [],
                dislikes: [], 
                views: [],
                published: {isPublished: true, publishedDate: new Date()},
            };
            let listIndex = store.lists.findIndex(list => list.name === 
            name && list.owner === "community-aggregate");

            if(listIndex !== -1){
                aggregateList = store.lists[listIndex];
                aggregateList.published.publishedDate = new Date();
            }
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
            //Make sure to change the item objects to strings so they can be 
            //saved in the backend
            aggregateList.items = rankings.sort((a,b) => b.votes - a.votes)
                                  .slice(0,5).map(item => "(" + item.votes 
            + " votes) " + item.name);
            aggregateLists.push(aggregateList);
        });    
        console.log(aggregateLists); 
    }

    //Filter the user's lists if there's something in the search bar
    //NOTE: Only for HomeScreen, the search field should return results that
    //START WITH the search query
    if (store.searchField !== ""){
        aggregateLists = aggregateLists.filter(list => list.name.toTitleCase() === store.searchField);
    }

    /* Filter the aggregate lists if a sorting option was chosen */
    if (store && store.sortField !== ""){
        if (store.sortField === "newest"){
            aggregateLists.sort((a,b) => {
                const dateA = new Date(a.created);
                const dateB = new Date(b.created);
                return dateB-dateA;
            });
        }
        else if (store.sortField === "oldest"){
            aggregateLists.sort((a,b) => {
                const dateA = new Date(a.created);
                const dateB = new Date(b.created);
                return dateA-dateB;
            });
        }
        else if (store.sortField === "views"){
            aggregateLists.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            aggregateLists.sort((a,b) => b.likes.length-a.likes.length);
        }
        else{
            aggregateLists.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }

    }

    return(
        <div className="background-screen" style={{overflow: "auto"}}> 
                <List sx={{ width: '96.8%', left: '1.6%'}}
                style={{maxHeight: '140%', overflow: 'auto'}}
                >
                    {
                        aggregateLists.map(list =>
                            <AggregateListCard 
                            list={list} />)
                    }
                </List>
        </div>
    )
};