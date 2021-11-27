import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useRef } from 'react';
import { GlobalStoreContext } from '../store'
import { useNavigate } from 'react-router';
import AuthContext from '../auth'
/*
    Workspace handles editing/creating lists. 
    It is a separate screen (route '/edit)
*/
export default function WorkspaceScreen(){
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();

    //isDisabled will determine whether to add a "disabled" field to the publish button or not
    let isDisabled = useRef(true);

    function handleListNameChange(event){
        console.log("called list change");
        let newList = store.currentList;
        newList.name = event.target.value;
        store.changeCurrentList(newList);
    }

    function handleItemChange(event, index){
        console.log("called item change");
        let newList = store.currentList;
        newList.items[index] = event.target.value;
        store.changeCurrentList(newList);
    }
    function handleSaveList(){
        console.log("called save list");
        store.updateCurrentList();
        navigate('/home');
    }
    
    function handlePublishList(){
        console.log("called publish list");
        let newList = store.currentList;
        newList.published.isPublished = true;
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        newList.published.publishedDate = today;
        store.changeCurrentList(newList);
        store.updateCurrentList();
        navigate('/home');
    }

    const BootstrapButton = styled(Button)({
        boxShadow: 'none',
        textTransform: 'none',
        fontSize: 30,
        fontWeight: "bold",
        padding: '6px 12px',
        border: '1px solid',
        lineHeight: 1.5,
        backgroundColor: '#D1D1D1',
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

    let workspace = "";
    //Check if the publish button should be enabled or disabled
    if(store.currentList){
        const regex = /^[A-Za-z0-9]+$/;
        if (store.currentList.name === ""){
            isDisabled.current = true;
        }
        else if (!regex.test(store.currentList.name.charAt(0))){
            isDisabled.current = true;
        }
        else if (store.currentList.items.indexOf("")!== -1){
            isDisabled.current = true;
        }
        else if (store.currentList.items.some(
            (val, i) => store.currentList.items.indexOf(val) !== i
          )){
            isDisabled.current = true;
          }
        else if (store.lists){
            //Check if this user already published a list with this name
            let duplicates = store.lists.filter(list => ((list.published.isPublished)
                    && (auth.user && list.owner === auth.user.username) &&
                    (list.name === store.currentList.name)));
            if (duplicates.length > 0){
                isDisabled.current = true;
            }
            else{
                let i=0;
                for (i = 0; i<5; i++){
                    if (!regex.test(store.currentList.items[i].charAt(0))){
                        isDisabled.current = true;
                        break;
                    }
                }
                if (i===5){
                    isDisabled.current=false;
                }
            }
        }
    }
    if (store.currentList){
        workspace = 
            <>
                <div id="workspace-screen">

                        <TextField id="list-name-textfield" 
                        label="List Name" variant="outlined"
                        defaultValue={store.currentList.name}
                        size="small"
                        style={{backgroundColor: "white", position:"relative"
                        ,right:"625px", top:"10px"}}
                        onChange={event => handleListNameChange(event)}/>
                    <div id="workspace-items-box">
                        <div id="workspace-items-numbers">
                            <div className="workspace-items-boxes">1</div><br/>
                            <div className="workspace-items-boxes">2</div><br/>
                            <div className="workspace-items-boxes">3</div><br/>
                            <div className="workspace-items-boxes">4</div><br/>
                            <div className="workspace-items-boxes">5</div><br/>
                        </div>
                    <div id="workspace-items-txtfields">
                    {
                                store.currentList.items.map((item, index)=>
                                    <>
                                        <Box
                                        component="form"
                                        sx={{
                                            '& > :not(style)': { m: 1, width: '131ch', 
                                            backgroundColor: "#E0A009", lineHeight:"75.5px"},
                                        }}
                                        noValidate
                                        autoComplete="off"
                                        >
                                            <TextField
                                            defaultValue={item}
                                            onChange={event => handleItemChange(event, index)}
                                            style={{border:"1px", borderRadius:"10px"}}
                                            variant="outlined"
                                            /><br/>
                                        </Box>
                                </>)
                        },
                    </div>
                    <div id="workspace-buttons">
                        <BootstrapButton onClick={()=>handleSaveList()}>
                            Save
                        </BootstrapButton>
                        &nbsp; &nbsp; &nbsp;
                        {
                            isDisabled.current ?
                            <BootstrapButton disabled>
                                Publish
                            </BootstrapButton> 
                            :                           
                            <BootstrapButton onClick={()=>handlePublishList()}>
                                Publish
                            </BootstrapButton>
                        }
                    </div>
                    </div>
                </div>  
            </>
    }



    return (
        <div className="background-screen">
            {workspace}
        </div>
    );
}