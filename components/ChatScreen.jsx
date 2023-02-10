import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from "@mui/material/IconButton";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import Message from "./Message";
import MicIcon from '@mui/icons-material/Mic';
import { useRef, useState } from "react";
import firebase from "firebase";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    var recipientEmail = getRecipientEmail(chat.users, user);
    const endOfMessageRef = useRef(null);
    const [input, setInput] = useState("");
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db.collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .orderBy("timestamp", "asc")
    )
    const [recipientSnapshots] = useCollection(
        db.collection("users").where("email", "==", recipientEmail), {
        onError: (error) => console.error(error)
    })
    function scrollToBottom() {
        endOfMessageRef?.current?.scrollIntoView({
            behaviour: "smooth",
            block: "start"
        })
    }
    function showMessages() {
        if (messagesSnapshot) {
            scrollToBottom();
            return messagesSnapshot.docs.map(message => (
                <Message key={message.id} user={message.data().user} message={
                    { ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }
                } />
            ))
        }
        else {
            scrollToBottom();
            return JSON.parse(messages).map(message => (<Message key={message.id} user={message.user} message={message} />))
        }
    }
    function sendMessage(event) {
        event.preventDefault();
        db.collection("users").doc(user.uid).set({
            // Update the last seen
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,

        })

        setInput("");
        scrollToBottom();
    }
    const recipient = recipientSnapshots?.docs?.[0]?.data();
    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail.substring(0, recipientEmail.indexOf("@"))}</h3>
                    {(recipient?.lastSeen) ? (
                        <p>Last active:&nbsp;
                            {recipient?.lastSeen?.toDate() && (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            )}
                        </p>) : (
                        <p>Last active:&nbsp;Unavailable</p>
                    )}

                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef}/>
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden type="submit" onClick={sendMessage} disabled={!input}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
    align-items: center;
`;

const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;
    > h3 {
        margin-bottom: 0;
    }
    > p {
        font-size: 14px;
        color: gray;
        margin-top: 0;
    }
`;
const EndOfMessage = styled.div`
margin-bottom: 50px;`;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: #fff;
z-index: 100;
`;
const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    align-items: center;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;
const HeaderIcons = styled.div`
display: flex;
align-items: center;
justify-content: center;
`;