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
require('@gouch/to-title-case')
/* 

AggregateListCard is essentially the same as ListCard, but adapted for 
community aggregate lists, which aren't saved to the backend, don't have
authors, and don't allow for deletion or editing.

*/
export default function AggregateListCard(props){
    const {list} = props;
    const {auth} = useContext(AuthContext);
    const{store} = useContext(GlobalStoreContext);
    const [expanded, setExpanded] = useState(false);


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


    const publishedDate = new Date(list.published.publishedDate);
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
        list.views.push("");
        store.updateList(list);
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

    const item1Name = list.items[0].substring(list.items[0].indexOf(")") + 2).toTitleCase();
    const item1Votes = " " +list.items[0].substring(0, (list.items[0].indexOf(")")+1));

    const item2Name = list.items[1].substring(list.items[1].indexOf(")") + 2).toTitleCase();
    const item2Votes = " " + list.items[1].substring(0, (list.items[1].indexOf(")")+1));

    const item3Name = list.items[2].substring(list.items[2].indexOf(")") + 2).toTitleCase();
    const item3Votes = " " +list.items[2].substring(0, (list.items[2].indexOf(")")+1));

    const item4Name = list.items[3].substring(list.items[3].indexOf(")") + 2).toTitleCase();
    const item4Votes = " " +list.items[3].substring(0, (list.items[3].indexOf(")")+1));

    const item5Name = list.items[4].substring(list.items[4].indexOf(")") + 2).toTitleCase();
    const item5Votes = " " +list.items[4].substring(0, (list.items[4].indexOf(")")+1));

    //Make sure newest comments are at the top by reversing the comments list
    let reversed = [];
    for (let k = list.comments.length-1; k>=0; k--){
            reversed.push(list.comments[k]);
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
                                &nbsp;1. &nbsp; &nbsp;{item1Name + item1Votes}<br/>
                                &nbsp;2. &nbsp; &nbsp;{item2Name + item2Votes}<br/>
                                &nbsp;3. &nbsp; &nbsp;{item3Name + item3Votes}<br/> 
                                &nbsp;4. &nbsp; &nbsp;{item4Name + item4Votes}<br/>
                                &nbsp;5. &nbsp; &nbsp;{item5Name + item5Votes}<br/>
                            </div>
                            <List sx={{width: '250%', height: "45%", overflow: "auto", padding: 0}}
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
                            {published}
                      </div> : <>{published}<br/></>
                    }
                </div>
                <div style={{position:"absolute", left:"86.5%", float:"right"}}>
                    <IconButton
                    style={{width:"110px"}}>
                        {
                            auth && auth.user && list.likes.includes(auth.user.username) ?
                            <ThumbUpAltIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("like")}/>
                            :
                            <ThumbUpAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("like")}/>

                        }
                            <strong style={{color:'black'}}>{list.likes.length}</strong>
                    </IconButton>
                    <IconButton style={{
                    width: "90px" ,maxWidth:"90px"}}>
                        {
                            auth && auth.user && list.dislikes.includes(auth.user.username) ? 
                            <ThumbDownAltIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("dislike")}/>
                            :
                            <ThumbDownAltOutlinedIcon style={{fontSize:"40px", color:'black'}}
                            onClick={()=>handleLikeDislike("dislike")}/>
                        }
                            <strong style={{color:'black'}}>{list.dislikes.length}</strong>
                    </IconButton>
                    &nbsp; &nbsp;
                    <br/>
                    {
                        !expanded ? 
                            <>
                                &nbsp; &nbsp; &nbsp;
                                <span style={{position:"absolute", top:"52%",width: "300px", maxWidth: "300px"}}>
                                    Views: {list.views.length}
                                </span> 
                            </> : 
                            <>
                                <span style={{position:"absolute", 
                                top:"412%",width: "300px", maxWidth: "300px"}}>
                                    Views: {list.views.length}
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