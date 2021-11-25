import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List'
import IconButton from '@mui/material/IconButton';
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
    const {list} = props;


    /* editOrPublished is used to decide if the edit button will appear for a unpublished list, or 
    if the date that the list was published will be shown */
    let editOrPublished = <>                    
                            <button className="listcard-edit-button">
                                <u>Edit</u>
                            </button>
                          </>;
    let listCardColor = "#F0ECC0";
    //Control which color the list card is based on whether this list was published or not
    if (list.isPublished){
        //Stringify the updatedAt field of this list
        console.log(list.updatedAt);
        const publishedAt = list.updatedAt.toString().substring(0, list.updatedAt.toString().indexOf("T"));
        editOrPublished = <>
                            <u>Published:</u> 
                            &nbsp;
                           {publishedAt}
                          </>;
        listCardColor="#CBC7F2";
        
    }

    //Make sure the background color is updated based on whos list it is (the current users vs. some other user)
    const StyledListItem = styled(ListItem)({
        border: "1px solid black", 
        borderRadius: "12px",
        backgroundColor: listCardColor,
        width: "100%",
        fontsize: "28pt"
    });


    function handleLoadList(id) {
        //expandListCard(id);
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
    

    return (
        <StyledListItem
        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <div style={{display: "block", position:"relative", right:"-10px", lineHeight: "2"}}>
                <div>
                    <strong style={{fontSize: "13pt", width: "500px",maxWidth: "500px"}}>{list.name}</strong> 
                    <div style={{display:'inline', position:'absolute',right:'-525%'}}>
                        <IconButton>
                                <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                                <strong style={{color:'black'}}>{list.likes}</strong>
                        </IconButton>
                        &nbsp;
                        <IconButton>
                            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            <strong style={{color:'black'}}>{list.dislikes}</strong>
                        </IconButton>
                        &nbsp;
                        <IconButton>
                            <DeleteOutlineOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                        </IconButton>
                    </div>
                    <br/>
                    <strong style={{fontSize:"9pt"}}>By: <u style={{color:"blue"}}>{list.owner}</u></strong><br/>
                    {editOrPublished}
                    <div style={{display: 'inline', position: 'relative', right: '-333%', fontSize: '9pt'}}> 
                        <strong>Views:  <div style={{display:'inline', color:"red"}}>{list.views} </div> </strong> 
                        <IconButton>
                            <KeyboardArrowDownOutlinedIcon style={{fontSize:"40px", color:'black', position:"absolute", left:"90px"}}/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </StyledListItem>
    );
}

export default ListCard;