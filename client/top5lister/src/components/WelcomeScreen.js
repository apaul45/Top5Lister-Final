import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../auth'
export default function WelcomeScreen() {
    const {auth} = useContext(AuthContext);
    const BootstrapButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 26,
        fontWeight: "bold",
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#88A4BA',
        borderColor: 'black',
        color: 'black',
        position: 'relative',
        bottom: "-20px",
        '&:hover': {
          backgroundColor: '#0069d9',
          borderColor: 'black',
          color: 'white',
          boxShadow: 'none',
        },
        '&:active': {
          boxShadow: 'none',
          backgroundColor: '#0062cc',
          borderColor: '#005cbf',
        },
        '&:focus': {
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        },
      });
    return (
        <div id="splash-screen" className="fade-in">
            <em>
                <strong id="welcome-text">Welcome to the<br/>
                Top 5 Lister!</strong>
            </em>
            <div className="description-box">
                    <strong>This site aims to give users a platform 
                    to create, share, and engage with other people's  own Top 5 Lists.
                    These Top 5 Lists can be about anything- sports, video games, famous 
                    people (like our developer), and more!  We hope to provide you with 
                    a place where you can make rankings about your favorite subjects 
                    and interact  with people that have the same interests as you.</strong>
            </div>
            <div id="welcome-button-box">
                <div className="welcome-button" style={{position: 'relative', left:"-90px"}}>
                    Already have an account? <br/> Login Below: <br/>
                    <Link to='/login'>
                        <BootstrapButton>
                                Sign In
                        </BootstrapButton>
                    </Link>
                </div>
                <div className="welcome-button">
                    Don't have an account yet? <br/> Register today! <br/>
                    <Link to="/register">
                        <BootstrapButton>
                                Create Account
                        </BootstrapButton>
                    </Link>
                </div>
                <div className="welcome-button" style={{position: 'relative', right:"-90px"}}>
                    Just want to browse? <br/> Continue as a guest below: <br/>
                    <Link to="/home">
                        <BootstrapButton onClick={()=>auth.allowGuest()}>
                            Continue as Guest
                        </BootstrapButton>
                    </Link>
                </div>
            </div>
            <div style={{position: "relative", bottom:"-300px", fontSize:"1vw"}}>
                This site was developed and is maintained by Ayon Paul
            </div>
        </div>
    )
}