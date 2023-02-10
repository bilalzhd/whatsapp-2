import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useEffect, useState } from "react";

function Sidebar() {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection("chats").where('users', 'array-contains', user.email);
    const [chatSnapshots] = useCollection(userChatRef);
    const [screenWidth, setScreenWidth] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setScreenWidth(window.innerWidth)
    }, [])

    window.addEventListener('resize', () => {
        setScreenWidth(window.innerWidth)
    })

    function createChat() {
        const input = prompt("Please Enter a email address for the user you wish to chat with");
        if (!input) return null;
        if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            // push the user's email to the chat history if doesn't already exist
            db.collection('chats').add({
                users: [user.email, input]
            })
        } else {
            alert("Either invalid email or chat already exists");
        }
    }
    const chatAlreadyExists = (recipientEmail) => !!chatSnapshots?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0);

    function signOut() {
        if (confirm("Do you really want to sign out?")) {
            auth.signOut();
        } else {
            return;
        }
    }
    function toggleSidebar() {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <MainContainer>
            {screenWidth < 768 && (
                <IconButton onClick={toggleSidebar}>
                    <MenuIcon />
                </IconButton>
            )}
            <Container style={{ display: sidebarOpen ? '' : 'none' }}>
                <Header>
                    <AvatarMenu>
                        <UserAvatar src={user?.photoURL} onClick={signOut} />
                    </AvatarMenu>
                    <IconsContainer>
                        <IconButton>
                            <ChatIcon />
                        </IconButton>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </IconsContainer>
                </Header>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder="Search chats" />
                </Search>
                <SidebarButton onClick={createChat}>
                    Start a New Chat
                </SidebarButton>

                {/* List of chats */}
                {chatSnapshots && chatSnapshots.docs.map(doc => (
                    <Chat key={doc.id} id={doc.id} users={doc.data().users} />
                ))}
            </Container>
        </MainContainer>
    )
}
export default Sidebar;

const MainContainer = styled.div`
display: flex;
flex-direction: column;
align-items: flex-start;
> button {
    margin-top: 20px;
    margin-left: 10px;
 }
`;
const Container = styled.div`
    flex: 1;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 340px;
    overflow-y: scroll;
    transition: all 1s;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    srollbar-width: none;
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    position: sticky;
    top: 0;
    padding: 15px;
    height: 80px;
    background-color: #fff;
`;
const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 20px;
    margin: auto 10px;
`;
const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }

`;
const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    margin-left: 10px;
`;
const UserAvatar = styled(Avatar)`
cursor: pointer;
:hover {
    opacity: 0.8;
}`;
const IconsContainer = styled.div``;
const AvatarMenu = styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: 14px;
`;
