import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import apis from "../axios-api/api";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER"
}

function AuthContextProvider(props) {
    /* Auth is the same as previous hw, but now theres a extra variable called "type". type will help
    with identifying if the user is a actual user or if they're a guest. If they're the latter, they'll be signed in 
    automatically upon pressing the guest button, but all textfields, save/publish, and like/dislike buttons will be 
    disabled. This is how foolproof design will be implemented */
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: "",
        type: "",

    });
    const history = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    },[auth.errorMessage]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage,
                    type: payload.type
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                    type:payload.type,
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage,
                    payload: payload.type,
                })
            }
            default:
                return auth;
        }
    }
    auth.getLoggedIn = async function () {
        try{
            const response = await apis.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: auth.errorMessage,
                        type: "user",
                    }
                });
            }
        }
        catch{
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: false,
                    //work plz
                    user: null,
                    errorMessage: auth.errorMessage,
                    type: auth.type,
                }
            })
        }
    }
    auth.registerUser = async function(userData, store) {
        try{
            const response = await apis.registerUser(userData);      
            if (response.status === 200) {
                //MAKE SURE THE ACCOUNT MODAL DOESNT APPEAR IF THE RESPONSE IS SUCCESSFUL
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        errorMessage: "",
                        type: "user",
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }   
        //IF AN ERROR OCCURS, UPDATE THE ERROR MESSAGE SO THAT ACCOUNT MODAL CAN DISPLAY IT
        catch(response){
            console.log(response.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: response.response.data.errorMessage,
                    type: auth.type,
                }
            });
        }
    }
    auth.loginUser = async function(userData, store) {
        console.log("loginUser", userData);
        try{
            const response = await apis.loginUser(userData);     
            console.log("loginUser", response); 
            if (response.status === 200) {
                //Make sure to update the type variable if theres a new registered user or user logged in
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        errorMessage: "",
                        type: "user",
                    }
                });
                history.push("/");
                store.loadIdNamePairs();
             }
        }
        //IF AN ERROR OCCURS, UPDATE THE ERROR MESSAGE SO THAT ACCOUNT MODAL CAN DISPLAY IT
        catch(response){
            console.log(response.response.data.errorMessage);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    errorMessage: response.response.data.errorMessage,
                    type: auth.type,
                }
            });
        }
    }
    //Allow a guest to view the site if they press the "continue as guest" button
    auth.allowGuest = function(){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                errorMessage: "",
                type: "guest",
            }
        });
    }
    auth.logoutUser = async function(){
        apis.logoutUser();
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                errorMessage: "",
                type: "",
            }
        });
        history.push('/');
    }
    //Use this auth store function to hide the account error modal when user presses ok
    auth.unmarkError = function(){
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                errorMessage: "", 
                type: auth.type,
            }
        });
    }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };