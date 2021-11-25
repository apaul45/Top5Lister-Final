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
    SET_SEARCH_FIELD : "SET_SEARCH_FIELD"
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
    const [store, setStore] = useState({
        lists: [],
        currentList: null,
        listNameActive: false,
        itemActive: false,
        listMarkedForDeletion: null,
        updateCurrentListCounter: 0,
        searchField: "",
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
                    searchField: store.searchField       
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
                    searchField: store.searchField               

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
                    searchField: store.searchField             

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
                    searchField: store.searchField               

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
                    searchField: store.searchField              
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
                    searchField: store.searchField       
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
                likes: 0,
                dislikes: 0, 
                views: 0,
                isPublished: false,
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
        const response = await apis.getAllTop5Lists();
        if (response.data.success) {
            let listsArray = response.data.top5Lists;
            storeReducer({
                type: GlobalStoreActionType.LOAD_LISTS,
                payload: listsArray
            });
        }
        else {
            console.log("apis FAILED TO GET THE LISTS");
        }
    }
    store.markListForDeletion = function(list){
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: list
            });
    }
    store.deleteList = async function(){
        let response = await apis.deleteTop5ListById(this.listMarkedForDeletion._id);
        if (response.data.success) {
            store.loadLists();
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
    store.updateSearchField = function(search){
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH_FIELD,
            payload: search,
        });
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