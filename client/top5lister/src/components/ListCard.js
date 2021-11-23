import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");

    const StyledListItem = styled(ListItem)({
        border: "1px solid black", 
        borderRadius: "12px",
        backgroundColor: "#F0ECC0",
        width: "100%",
        fontsize: "28pt"
    });


    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        // let newActive = !editActive;
        // if (newActive) {
        //     store.setIsListNameEditActive();
        // }
        // setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let cardElement =
        <StyledListItem

            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            button
            onClick={(event) => {
                //handleLoadList(event, idNamePair._id)
            }
            }
        >
            <div style={{display: "block", position:"relative", right:"-10px", lineHeight: "2"}}>
                <div>
                    <strong style={{fontSize: "13pt"}}> Games</strong> 
                    <div style={{display:'inline', position:'relative',right:'-305%'}}>
                        <IconButton>
                            <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            <strong style={{color:'black'}}>800K</strong>
                        </IconButton>
                            &nbsp;
                        <IconButton>
                            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            <strong style={{color:'black'}}>500K</strong>
                        </IconButton>
                        &nbsp;
                        <IconButton>
                            <DeleteOutlineOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                        </IconButton>
                    </div>
                    <br/>
                    <strong style={{fontSize:"9pt"}}>By: <u>mckenna</u></strong><br/>
                    <button className="listcard-edit-button">
                        <u>Edit</u>
                    </button>
                    <div style={{display: 'inline', position: 'relative', right: '-317%', fontSize: '9pt'}}> 
                        <strong>Views:  <div style={{display:'inline', color:"red"}}>1eeeee000 </div> </strong>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;&nbsp;  
                        <IconButton>
                            <KeyboardArrowDownOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                        </IconButton>
                    </div>
                </div>
            </div>

        </StyledListItem>

    return (
        cardElement
    );
}

export default ListCard;