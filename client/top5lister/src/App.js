import './App.css';
import { React } from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import {
    AppBanner,
    RegisterScreen,
    LoginScreen,
    DeleteModal,
    AccountErrorModal,
    WelcomeScreen,
    NavBar,
    HomeScreen,
    Statusbar
} from './components/Moduler'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store & auth into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>              
                    <AppBanner />
                    <NavBar />
                    <Routes>
                        {/* <Route path="/logout/" exact component={HomeWrapper} /> */}
                        {/* When the user presses "Create Account", the server jumps to the register route, which 
                        will handle creating and saving a new account*/}
                        <Route exact path="/" element={<WelcomeScreen />}/>
                        <Route exact path="/register" element={<RegisterScreen/>} />
                        {/*When the user presses "Login", the server jumps to the login route, which will handle
                        verifying a user account */}
                        <Route exact path="/login" element={<LoginScreen/>} />
                        <Route exact path="/home" element={<HomeScreen/>} />
                    </Routes>
                    <Statusbar/>
                    <DeleteModal />
                    <AccountErrorModal />
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App
