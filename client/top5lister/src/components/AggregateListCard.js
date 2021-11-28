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
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

/* 

AggregateListCard is essentially the same as ListCard, but adapted for 
community aggregate lists, which aren't saved to the backend, don't have
authors, and don't allow for deletion or editing.

*/
export default function AggregateListCard(props){
    const {list} = props;
    const {auth} = useContext(AuthContext);
    const [comments, setComments] = useState(list.comments);
    const [likes, setLikes] = useState(list.likes);
    const [dislikes, setDislikes] = useState(list.dislikes);
    const [views, setViews] = useState(list.views);
    const [expanded, setExpanded] = useState(false);

    console.log(likes);
    console.log(dislikes);

    //Make sure the background color is updated based on whos list it is (the current users vs. some other user)
    const StyledListItem = styled(ListItem)({
        border: "1px solid black", 
        borderRadius: "12px",
        backgroundColor: "#CBC7F2",
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


    const publishedDate = new Date(list.created);
    const publishedDateString = publishedDate.toDateString().substring(4);
    let published = <>
                        <u>Published:</u> 
                        &nbsp;
                       {publishedDateString}
                      </>;
    
    
    //handleExpandedList should set the expanded variable to true so that the items can be shown, and 
    //then update view count to be updated in the back end 
    function handleExpandedList(event){
        setExpanded(true);
        setViews(views+1);
    }



    /* handleUpdateComments should add the new comment to this list 
    if the user pressed enter */
    function handleUpdateComments(event){
        if (event.key === 'Enter'){
            event.preventDefault();
            setComments([...comments, [(auth.user ? auth.user.username : "")
            , event.target.value]]);
            console.log(comments);
        }
    }

        /* handleLikeDislike will handle updating the liked and disliked button, as well as the 
    like and/or dislike count of this list */
    function handleLikeDislike(param){
        if (auth.type !== "guest"){
            if (param === "like"){
                if (likes.includes(auth.user.username)){
                    //If the user clicks like after already clicking it once, remove their like
                    setLikes(likes.filter(username => username !== auth.user.username));
                }
                else if (dislikes.includes(auth.user.username)){
                    setDislikes(dislikes.filter(username => username !== auth.user.username));
                    setLikes([...likes,auth.user.username]);
                }
                else{
                    setLikes([...likes,auth.user.username]);
                }
            }
            else{
                if (likes.includes(auth.user.username)){
                    setLikes(likes.filter(username => username !== auth.user.username));
                    setDislikes([...dislikes, auth.user.username]);
                }
                else if (dislikes.includes(auth.user.username)){
                    setDislikes(dislikes.filter(username => username !== auth.user.username));
                }
                else{
                    setDislikes([...dislikes, auth.user.username]);
                }
            }
        }
    }


    return (
        <StyledListItem
        sx={{ marginTop: '5px', display: 'flex', p: 1 }}
        >
            <div className="outer-list-card">
                <div>
                    <strong style={{fontSize: "13pt"}}>{list.name.toTitleCase()}</strong><br/>
                    <br/>
                    {expanded ?
                      <div>
                            <div className="expanded-list-items">
                                &nbsp;1. &nbsp; &nbsp;{list.items[0].name.toTitleCase()} {"(" +
                                list.items[0].votes + " votes)"}<br/>
                                &nbsp;2. &nbsp; &nbsp;{list.items[1].name.toTitleCase()} {"(" +
                                list.items[1].votes + " votes)"}<br/>
                                &nbsp;3. &nbsp; &nbsp;{list.items[2].name.toTitleCase()} {"(" +
                                list.items[2].votes + " votes)"} <br/>
                                &nbsp;4. &nbsp; &nbsp;{list.items[3].name.toTitleCase()} {"(" +
                                list.items[3].votes + " votes)"}<br/>
                                &nbsp;5. &nbsp; &nbsp;{list.items[4].name.toTitleCase()} {"(" +
                                list.items[4].votes + " votes)"}<br/>
                            </div>
                            <List sx={{width: '250%', height: "45%", overflow: "auto"}}
                            style={{position:"absolute", top: "16.5%",left: "49%"}}>
                                {
                                    comments.map(comment =>
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
                            {published}
                      </div> : <>{published}<br/></>
                    }
                </div>
                <div style={{position:"absolute", left:"86.5%", float:"right"}}>
                    <IconButton
                    style={{width:"110px"}}>
                        {
                            auth && auth.user && likes.includes(auth.user.username) ?
                            <ThumbUpAltIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("like")}/>
                            :
                            <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("like")}/>

                        }
                            <strong style={{color:'black'}}>{likes.length}</strong>
                    </IconButton>
                    <IconButton style={{
                    width: "90px" ,maxWidth:"90px"}}>
                        {
                            auth && auth.user && dislikes.includes(auth.user.username) ? 
                            <ThumbDownAltIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("dislike")}/>
                            :
                            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("dislike")}/>
                        }
                            <strong style={{color:'black'}}>{dislikes.length}</strong>
                    </IconButton>
                    &nbsp; &nbsp;
                    <br/>
                    {
                        !expanded ? 
                            <>
                                &nbsp; &nbsp; &nbsp;
                                <span style={{position:"absolute", top:"52%",width: "300px", maxWidth: "300px"}}>
                                    Views: {views}
                                </span> 
                            </> : 
                            <>
                                <span style={{position:"absolute", 
                                top:"412%",width: "300px", maxWidth: "300px"}}>
                                    Views: {views}
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