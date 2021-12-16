import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apis from '../axios-api/api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED

/* SET_SEARCH_FIELD will simply be used to update the searchField 
//state  variable */
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_LISTS: "LOAD_LISTS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_SEARCH_FIELD : "SET_SEARCH_FIELD",
    SET_SORT : "SET_SORT"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE

    /*updateCurrentListCounter will be used to update the visibility of 
    the publish button in the workspace screen */

    /* searchField will be used to contain what is written in the 
    search textfield, so that different screens can access it and 
    update the lists displayed accordingly */

    /* sortField should be used to identify which sorting method to 
    complete in the given screen */
    const [store, setStore] = useState({
        lists: [],
        currentList: null,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        updateCurrentListCounter: 0,
        searchField: "",
        sortField: "",
    });


    const history = useNavigate();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    lists: payload.lists,
                    currentList: payload.top5List,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: store.sortField      
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    lists: payload.lists,
                    currentList: payload.currentList,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null, 
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: ""                   

                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_LISTS: {
                return setStore({
                    lists: payload,
                    currentList: null,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,   
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: "",                 

                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload, 
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: store.sortField                   

                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    lists: store.lists,
                    currentList: null,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,  
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: store.sortField                  
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    lists: store.lists,
                    currentList: payload.top5List,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,  
                    updateCurrentListCounter: payload.counter,
                    searchField: store.searchField,
                    sortField: "",           
                });
            }
            case GlobalStoreActionType.SET_SEARCH_FIELD:{
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,  
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: payload,
                    sortField: store.sortField        
                });
            }
            case GlobalStoreActionType.SET_SORT:{
                return setStore({
                    lists: store.lists,
                    currentList: store.currentList,
                    isListNameEditActive: store.isListNameEditActive,
                    isItemEditActive: store.isItemEditActive,
                    listMarkedForDeletion: store.listMarkedForDeletion,  
                    updateCurrentListCounter: store.updateCurrentListCounter,
                    searchField: store.searchField,
                    sortField: payload     
                });
            }
            default:
                return store;
        }
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        try{
            let payload = {
                name: "New List",
                items: ["?", "?", "?", "?", "?"],
                owner: auth.user.username, 
                comments: [],
                likes: [],
                dislikes: [], 
                views: [],
                published: {isPublished: false, publishedDate:new Date()}
            };
            let response = await apis.createTop5List(payload);
            if (response.data.success) {
                let newList = response.data.top5List;
                //Get all the new lists in the database
                response = await apis.getAllTop5Lists();
                if(response.data.success){
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {currentList: newList, lists: response.data.top5Lists}
                    });
                }
            }
        }
        catch{
            console.log("apis FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE LISTS IN THE DATABASE
    store.loadLists = async function () {
        try{
            const response = await apis.getAllTop5Lists();
            if (response.data.success) {
                let listsArray = response.data.top5Lists;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LISTS,
                    payload: listsArray
                });
            }
        }
        catch(err){
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: []
            });
        }
    }
    store.markListForDeletion = function(list){
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: list
            });
    }
    store.deleteList = async function(){
        try{
            let response = await apis.deleteTop5ListById(this.listMarkedForDeletion._id);
            if (response.data.success){
                store.loadLists();
            }
        }
        catch(err){
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: store.lists.filter(list => list._id !== store.listMarkedForDeletion._id)
            });
        }
    }
    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    store.setCurrentList = async function (id) {
        let response = await apis.getTop5ListById(id);
        if (response.data.success) {
            let top5List = response.data.top5List;

            response = await apis.updateTop5ListById(top5List._id, top5List);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {top5List: top5List, counter: store.updateCurrentListCounter}
                });
                /*Navigate the user to the edit screen to edit, save, and potentially
                //publish their new list */
                history('/edit');
            }
        }
    }
    //store.changeCurrentList is for updating the textfields in workspace
    store.changeCurrentList= function(newList){
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: {top5List: newList, counter: store.updateCurrentListCounter+1}
        });
    }
    store.updateCurrentList = async function () {
        let response = await apis.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {top5List: null, counter: store.updateCurrentListCounter}
            });
            response = await apis.getAllTop5Lists();
            if (response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.LOAD_LISTS,
                    payload: response.data.top5Lists
                });
            }
        }
    }
    /* updateSearchField should call th SET_SEARCH_FIELD action type,
    which will only update the search field variable and nothing else */
    store.updateSearchField = function(type, event){
        if (type==="keypress" && event.key === "Enter"){
            event.preventDefault();
            storeReducer({
                type: GlobalStoreActionType.SET_SEARCH_FIELD,
                payload: event.target.value,
            });
        }
        else if (type === "change"){
            storeReducer({
                type: GlobalStoreActionType.SET_SEARCH_FIELD,
                payload: event.target.value,
            });
        }
        else{
            storeReducer({
                type: GlobalStoreActionType.SET_SEARCH_FIELD,
                payload: "",
            });
        }
    }

    /* updateList should handle updates to any list card (this is the same
        as updateCurrentList but made particularly for updating like dislike and 
        view counts) */
    store.updateList = async function (list){
        if (list.hasOwnProperty('_id')){
            let response = await apis.updateTop5ListById(list._id, list);
            if (response.data.success){
                response = await apis.getAllTop5Lists();
                if (response.data.success){
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_LISTS,
                        payload: response.data.top5Lists
                    });
                }
            }
        }
        else{
            /* If this list doesn't have an id, that means this is a 
            unsaved community aggregate list. That means its items 
            have to be adjusted to become strings that can be used */
            let response = await apis.createTop5List(list);
            if (response.data.success) {
                let newList = response.data.top5List;
                //Get all the new lists in the database
                response = await apis.getAllTop5Lists();
                if(response.data.success){
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: {currentList: newList, lists: response.data.top5Lists}
                    });
                }
            }
        }
    }

    /* setSortField should be used to set which sort operation to perform 
    in the given screen */
    store.setSortField = function(sort){
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: sort
        });
    }

    //Pass in the list shown in a screen to this function, which will handle sorting and returning the
    //sorted list
    store.sortList = function(screenList){
        const publishedLists = screenList.filter((list) => list.published.isPublished);
        const savedLists = screenList.filter((list) => !list.published.isPublished);
        if (store.sortField === "newest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateB-dateA;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            screenList = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "oldest"){
            publishedLists.sort((a,b) => {
                const dateA = new Date(a.published.publishedDate);
                const dateB = new Date(b.published.publishedDate);
                return dateA-dateB;
            });
            /* Make sure to only sort the published lists, and leave
            unpublished lists at the bottom */
            screenList = [...publishedLists, ...savedLists];
        }
        else if (store.sortField === "views"){
            screenList.sort((a,b) => b.views.length-a.views.length);
        }
        else if (store.sortField === "likes"){
            screenList.sort((a,b) => b.likes.length-a.likes.length);
        }
        else if (store.sortField === "dislikes"){
            screenList.sort((a,b) => b.dislikes.length-a.dislikes.length);
        }
        else if (store.sortField.includes("name")){
            if (store.sortField.includes("a-z")){
                //ake sure to compare the first letter of each name for the A-Z & Z-A sorting options
                screenList.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            }
            else{
                screenList.sort((a,b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
            }
        }
        else{
            if (store.sortField.includes("a-z")){
                screenList.sort((a,b) => a.owner.toLowerCase().localeCompare(b.owner.toLowerCase()));
            }
            else{
                screenList.sort((a,b) => b.owner.toLowerCase().localeCompare(a.owner.toLowerCase()));
            }
        }
        return screenList;

    }

    //Filter the given screen's lists by what's in the search bar:
    //all have the same filter logi except for aggregate lists
    store.filterBySearch = function(screenList, screenType){
        //Filter logic for user lists & all lists screens
        if (screenType === "user-lists" || screenType === "all-lists"){
            screenList = store.lists.filter(list => {
        
                if(store.searchField !== "" && list.owner.toLowerCase() === store.searchField.toLowerCase()){
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
                /* Make sure all published lists are part of what gets shown on this screen
                (this is so that guests can also view and search for specific things) */
                else if (store.lists && auth.type){
                    /* Only allow the user's saved lists to appear: everyone else's lists
                    that appear on this screen should be published */
                    screenList.current = store.lists.filter(list => {
                        if (auth.user && auth.user.username === list.owner){
                            return list;
                        }
                        else{
                            if (list.owner !== "community-aggregate" && list.published.isPublished){
                                return list;
                            }
                        }
                    });
                }
            });
        }
        //Logic for community screen
        else if (screenType === "aggregate"){
            screenList = screenList.filter(list => list.name.toLowerCase() 
                                       === store.searchField.toLowerCase());
        }
        //Logic for home screen
        else{
            screenList = screenList.filter(list => list.name.toLowerCase()
                            .startsWith(store.searchField.toLowerCase()));
        }
        return screenList;
    }
    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };