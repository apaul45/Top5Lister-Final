import { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { useNavigate } from 'react-router-dom';
import { formControlLabelClasses } from '@mui/material';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
*/

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);
    const[expanded, setExpanded] = useState(false); 
    const {list} = props;
    const navigate = useNavigate();

    /* editOrPublished is used to decide if the edit button will appear for a unpublished list, or 
    if the date that the list was published will be shown */
    let editOrPublished = "";
    let secondRef = editOrPublished;
    let listCardColor = "#F0ECC0";
    //Only allow the delete button to appar if this is the current user's list
    let deleteButton = <div></div>;


    /*Only allow the edit and delete button to appear if there's an actual user logged in
    and if the list is the current user's list. */
    //
    if (auth.user && auth.user.username === list.owner){
        editOrPublished = <>                    
                            <button className="listcard-edit-button" onClick={()=>handleEditList()}>
                                <u>Edit</u>
                            </button>
                          </>;
        secondRef = editOrPublished;
        deleteButton = <>
                            <IconButton onClick={(event)=>handleDeleteList(event)}>
                                <DeleteOutlineOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                            </IconButton><br/> 
                       </>
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
            secondRef = editOrPublished;
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

    const StyledCommentItem = styled(ListItem)({
        border: "1px solid black", 
        borderRadius: "12px",
        backgroundColor: "#E0A009",
        width: "20%",
        fontsize: "8pt"
    });
    function handleEditList(){
        store.setCurrentList(list._id);
        navigate('/edit');
    }
    async function handleDeleteList(event) {
        event.stopPropagation();
        store.markListForDeletion(list);
    }
    
    //handleExpandedList should set the expanded variable to true so that the items can be shown, and 
    //then update view count to be updated in the back end 
    function handleExpandedList(event){
        setExpanded(true);
    
        if (auth.type !== "guest"){
            list.views++;
            store.updateList(list);
        }
    }
    console.log(list.comments);
    return (
        <StyledListItem
        sx={{ marginTop: '5px', display: 'flex', p: 1 }}
        >
            <div className="outer-list-card">
                <div>
                    <strong style={{fontSize: "13pt"}}>{list.name}</strong><br/>
                    <strong style={{fontSize:"9pt"}}>By: <u style={{color:"blue"}}>{list.owner}</u></strong><br/>
                    {expanded ?
                      <div>
                            <div className="expanded-list-items">
                                &nbsp;1. &nbsp; &nbsp;{list.items[0]} <br/>
                                &nbsp;2. &nbsp; &nbsp;{list.items[1]} <br/>
                                &nbsp;3. &nbsp; &nbsp;{list.items[2]} <br/>
                                &nbsp;4. &nbsp; &nbsp;{list.items[3]} <br/>
                                &nbsp;5. &nbsp; &nbsp;{list.items[4]} <br/>
                            </div>
                            <List sx={{width: '50%'}}
                            style={{position:"absolute", top: "22.2%",left: "49%"}}>
                                {
                                    list.comments.map(comment =>
                                        <div className="comment-style">
                                            {comment[0]} <br/>
                                            {comment[1]}
                                        </div>
                                    )
                                }
                            </List>
                            {editOrPublished}
                      </div> : <>{editOrPublished}<br/></>
                    }
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
                    {deleteButton}<br/>
                    {
                        !expanded ? 
                            <>
                                &nbsp; &nbsp; &nbsp;
                                <span style={{position:"absolute", top:"52%",width: "300px", maxWidth: "300px"}}>
                                    Views: {list.views}
                                </span> 
                            </> : 
                            <>
                                <span style={{position:"absolute", 
                                top:"420%",width: "300px", maxWidth: "300px"}}>
                                    Views: {list.views}
                                </span> 
                            </>
                    }
                    
                    { expanded ?

                    <IconButton 
                    onClick={()=>setExpanded(false)}
                    style={{position:"absolute",top:"405%", right:"0.15%",float:"right"}}>
                            <KeyboardArrowUpOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                    </IconButton> 
                    
                    : 

                        <IconButton 
                    onClick={()=>handleExpandedList()}
                    style={{position:"absolute",top:"46%", right:"0.15%",float:"right"}}>
                            <KeyboardArrowDownOutlinedIcon style={{fontSize:"40px", color:'black'}}/>
                    </IconButton>
                    }
                </div>

            </div>
        </StyledListItem>


    );
}

export default ListCard;