import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import { useNavigate } from 'react-router';

/*
    Workspace handles editing/creating lists. 
    It is a separate screen (route '/edit)
*/
export default function WorkspaceScreen(){
    const { store } = useContext(GlobalStoreContext);
    const navigate = useNavigate();
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

    function handleListNameChange(event){
        store.currentList.name = event.target.value;
        store.changeCurrentList();
    }

    function handleItemChange(event, index){
        store.currentList.items[index] = event.target.value;
        store.changeCurrentList();
    }
    function handleSaveList(){
        store.updateCurrentList();
        navigate('/home');
    }
    
    function handlePublishList(){

    }
    let workspace = "";
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
                        <BootstrapButton onClick={()=>handlePublishList()}>
                            Publish
                        </BootstrapButton> 
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