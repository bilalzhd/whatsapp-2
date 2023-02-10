import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { auth } from "../../firebase";
import Link from "next/link";
import { Button } from "@mui/material";

function Chat({ messages, chat }) {
    const [ user ] = useAuthState(auth);
    if(!chat.users.includes(user.email)){
        return (<Container>
        <p>You are in the wrong chat accidentally.</p>
            <Link href="/"><Button>Go Back</Button></Link>
            </Container>
        )

    }
    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id);

    // Prepare the messages on the server
    const messagesRes = await ref.collection("messages").orderBy("timestamp", "asc").get();
    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }))
    // Prepare the chats
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    }
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }

}

const Container = styled.div`
display: flex;

`;
const ChatContainer = styled.div`
flex: 1;
overflow: scroll;
height: 100vh;
::-webkit-scrollbar {
    display: none;
}
-ms-overflow-style: none;
scrollbar-width: none;
`;