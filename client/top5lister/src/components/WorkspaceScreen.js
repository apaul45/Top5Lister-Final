import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles';
/*
    Workspace handles editing/creating lists. 
    It is a separate screen (route '/edit)
*/
export default function WorkspaceScreen(){
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
    const StyledTextField = styled(TextField)({
        backgroundColor: '#D9AD0F',
        border: "1px",
        borderRadius: "10px",
        display: "block",
        lineHeight: "70px",
    });
    return (
        <div className="background-screen">
            <div id="workspace-screen">
                <TextField id="list-name-textfield" 
                label="Listname" variant="outlined"/>
                <div id="workspace-items-box">
                    <div id="workspace-items-numbers">
                        <div className="workspace-items-boxes">1</div><br/>
                        <div className="workspace-items-boxes">2</div><br/>
                        <div className="workspace-items-boxes">3</div><br/>
                        <div className="workspace-items-boxes">4</div><br/>
                        <div className="workspace-items-boxes">5</div><br/>
                    </div>
                    <div id="workspace-items-txtfields">
                        <StyledTextField id="item1-textfield" label="Item1" variant="outlined"/><br/>
                        <StyledTextField id="item2-textfield" label="Item2" variant="outlined"/><br/>
                        <StyledTextField id="item3-textfield" label="Item3" variant="outlined"/><br/>
                        <StyledTextField id="item4-textfield" label="Item4" variant="outlined"/><br/>
                        <StyledTextField id="item5-textfield" label="Item5" variant="outlined"/><br/>
                    </div>
                </div>
                <div id="workspace-buttons">
                    <BootstrapButton>
                        Save
                    </BootstrapButton>
                    &nbsp; &nbsp; &nbsp;
                    <BootstrapButton>
                        Publish
                    </BootstrapButton> 
                </div>
            </div>
        </div>
    );
}