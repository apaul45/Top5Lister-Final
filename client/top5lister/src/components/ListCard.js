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
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
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
                            <button id="listcard-edit-button" onClick={()=>handleEditList()}
                            style={{color: "red"}}>
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
    if (list.published.isPublished){
        //Stringify the updatedAt field of this list
            console.log(list.updatedAt);
            const publishedDate = new Date(list.published.publishedDate);
            const publishedDateString = publishedDate.toDateString().substring(4);
            editOrPublished = <>
                                <strong>Published:</strong> 
                                &nbsp;
                                <strong style = {{color: "green"}}>
                                    {publishedDateString}
                                </strong>
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
        fontsize: "28pt",
    });

    const StyledCommentItem = styled(ListItem)({
        overflow: "auto",
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
        //Only allow views to be updated when expanding a published list
        if (list.published.isPublished){
            if (auth.type !== "guest"){
                list.views.push(auth.user.username);
                store.updateList(list);
            }
            else{
                list.views.push("");
                store.updateList(list);
            }
        }
    }

    /* handleUpdateComments should add the new comment to this list 
    if the user pressed enter */
    function handleUpdateComments(event){
        if (event.key === 'Enter'){
            event.preventDefault();
            list.comments.push([(auth.user ? auth.user.username : ""), event.target.value]);
            store.updateList(list);
        }
    }


    /* handleLikeDislike will handle updating the liked and disliked button, as well as the 
    like and/or dislike count of this list */
    function handleLikeDislike(param){
        if (auth.type !== "guest"){
            if (param === "like"){
                if (list.likes.includes(auth.user.username)){
                    //If the user clicks like after already clicking it once, remove their like
                    list.likes = list.likes.filter(username => username !== auth.user.username);
                }
                else if (list.dislikes.includes(auth.user.username)){
                    list.dislikes = list.dislikes.filter(username => username !== auth.user.username);
                    list.likes.push(auth.user.username);
                }
                else{
                    list.likes.push(auth.user.username);
                }
            }
            else{
                if (list.likes.includes(auth.user.username)){
                    list.likes = list.likes.filter(username => username !== auth.user.username);
                    list.dislikes.push(auth.user.username);
                }
                else if (list.dislikes.includes(auth.user.username)){
                    list.dislikes = list.dislikes.filter(username => username !== auth.user.username);
                }
                else{
                    list.dislikes.push(auth.user.username);
                }
            }
            store.updateList(list);
        }
    }




    //Make sure newest comments are at the top by reversing the comments list
    let reversed = [];
    for (let k = list.comments.length-1; k>=0; k--){
        reversed.push(list.comments[k]);
    }
    console.log(reversed);
    return (
        <StyledListItem
        sx={{ marginTop: '5px', display: 'flex', p: 1 }}
        >
            <div className="outer-list-card">
                <div>
                    <strong style={{fontSize: "13pt"}}>{list.name}</strong><br/>
                    <strong style={{fontSize:"9pt"}}>By: <u style={{color:"blue"}}>{list.owner}</u></strong>
                    <br/>
                    {expanded ?
                      <div>
                            <div className="expanded-list-items">
                                &nbsp;1. &nbsp; &nbsp;{list.items[0]} <br/>
                                &nbsp;2. &nbsp; &nbsp;{list.items[1]} <br/>
                                &nbsp;3. &nbsp; &nbsp;{list.items[2]} <br/>
                                &nbsp;4. &nbsp; &nbsp;{list.items[3]} <br/>
                                &nbsp;5. &nbsp; &nbsp;{list.items[4]} <br/>
                            </div>
                            <List sx={{width: '250%', height: "45%", overflow: "auto"}}
                            style={{position:"absolute", top: "16.5%",left: "49%"}}>
                                {
                                    reversed.map(comment =>
                                        <>
                                        <StyledCommentItem>
                                            <div>
                                                <strong>
                                                    <u style={{color:"blue"}}>{comment[0]}</u>
                                                </strong><br/>
                                                {comment[1]} <br/>
                                            </div>
                                                
                                        </StyledCommentItem> <br/>
                                        </>
                                    )
                                }
                            </List>
                            {
                                auth && auth.type !== "guest" ?

                                <Box
                                component="form"
                                sx={{
                                '& > :not(style)': { m: 1, width: '73.8ch',
                                backgroundColor: "white" }, 
                                position: "relative", right:"-500px"
                                }}
                                noValidate
                                autoComplete="off"
                                >
                                    <TextField id="outlined-basic" size="medium" label="Add Comment" variant="outlined"
                                    style={{position: "relative", right:"-210px", top:"-65px",
                                    border:"1px", borderRadius:"12px"}}
                                    onKeyPress={(event)=> handleUpdateComments(event)}/>
                                </Box> 

                                : 

                                <Box
                                component="form"
                                sx={{
                                '& > :not(style)': { m: 1, width: '35ch'}
                                }}
                                noValidate
                                autoComplete="off"
                                > </Box>
                            }
                            {editOrPublished}
                      </div> : <>{editOrPublished}<br/></>
                    }
                </div>
                <div style={{position:"absolute", left:"80.5%", float:"right"}}>
                    <IconButton
                    style={{width:"110px"}}>
                        {
                            auth && auth.user && list.likes.includes(auth.user.username) ?
                            
                            <>
                                <ThumbUpAltIcon style={{fontSize:"40px", color:'black'}}
                                onClick={()=>handleLikeDislike("like")}/>

                                <strong style={{color:'black'}}>
                                    {list.likes.length}
                                </strong>
                            </>
                            
                            
                            : list.published.isPublished ? 
                            <>
                                <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                                onClick={()=>handleLikeDislike("like")}/> 

                                <strong style={{color:'black'}}>
                                    {list.likes.length}
                                </strong>
                            </>
                            : ""

                        }
                    </IconButton>
                    <IconButton style={{
                    width: "90px" ,maxWidth:"90px"}}>
                        {
                            auth && auth.user && list.dislikes.includes(auth.user.username) ? 
                            <>
                                <ThumbDownAltIcon style={{fontSize:"40px", color:'black'}}
                                onClick={()=>handleLikeDislike("dislike")}/>

                                <strong style={{color:'black'}}>
                                    {list.dislikes.length}
                                </strong>
                            </>

                            :
                            list.published.isPublished ? 
                            <>
                                <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                                onClick={()=>handleLikeDislike("dislike")}/> 

                                <strong style={{color:'black'}}>
                                    {list.dislikes.length}
                                </strong>
                            </>
                            
                            : ""
                        }
                    </IconButton>
                    &nbsp; &nbsp;
                    {deleteButton}<br/>
                    {
                        !expanded ? 
                            <>
                                &nbsp; &nbsp; &nbsp;
                                <span style={{position:"absolute", top:"52%",width: "300px", maxWidth: "300px"}}>
                                     {list.published.isPublished ? "Views : " + list.views.length : ""}
                                </span> 
                            </> : 
                            <>
                                <span style={{position:"absolute", 
                                top:"412%",width: "300px", maxWidth: "300px"}}>
                                    {list.published.isPublished ? "Views : " + list.views.length : ""}
                                </span> 
                            </>
                    }
                    
                    { expanded ?

                    <IconButton 
                    onClick={()=>setExpanded(false)}
                    style={{position:"absolute",top:"400%", right:"0.15%"}}>
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