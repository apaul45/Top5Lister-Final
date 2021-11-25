import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
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
import { useNavigate } from 'react-router-dom';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const {list} = props;
    const navigate = useNavigate();

    /* editOrPublished is used to decide if the edit button will appear for a unpublished list, or 
    if the date that the list was published will be shown */
    let editOrPublished = "";
    let listCardColor = "#F0ECC0";



    /*Only allow the edit button to appear if there's an actual user logged in
    and if the list is the current user's list. */
    //
    if (auth.user && auth.user.username === list.owner){
        editOrPublished = <>                    
        <button className="listcard-edit-button" onClick={()=>handleEditList()}>
            <u>Edit</u>
        </button>
      </>;
    }

    /*Control which color the list card is and make the publish date 
    visible based on whether this list was published or not */
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
    function handleEditList(){
        store.setCurrentList(list._id);
        navigate('/edit');
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

    async function handleDeleteList(event) {
        event.stopPropagation();
        store.markListForDeletion(list);
    }
    

    return (
        <StyledListItem
        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
        >
            <div style={{display: "flex",lineHeight: "2"}}>
                <div>
                    <strong style={{fontSize: "13pt"}}>{list.name}</strong><br/>
                    <strong style={{fontSize:"9pt"}}>By: <u style={{color:"blue"}}>{list.owner}</u></strong><br/>
                    {editOrPublished}
                </div>

                <div style={{position:"absolute", left:"80.5%"}}>
                    <IconButton
                    style={{width:"110px"}}>
                        <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            <strong style={{color:'black'}}>{list.likes}</strong>
                    </IconButton>
                    <IconButton style={{
                    width: "90px" ,maxWidth:"90px"}}>
                            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            <strong style={{color:'black'}}>{list.dislikes}</strong>
                    </IconButton>
                    &nbsp; &nbsp;
                    <IconButton onClick={(event)=>handleDeleteList(event)}>
                            <DeleteOutlineOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                    </IconButton><br/> &nbsp; &nbsp; &nbsp;
                    <span style={{width: "300px", maxWidth: "300px"}}>Views: {list.views}</span>
                    <IconButton style={{position:"absolute", right:"0.15%"}}>
                            <KeyboardArrowDownOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                    </IconButton>
                </div>

            </div>
        </StyledListItem>
    );
}

export default ListCard;