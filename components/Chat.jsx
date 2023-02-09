import styled from 'styled-components';
import { Avatar } from '@mui/material';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from 'next/router';

function Chat({ id, users }) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const recipientEmail = getRecipientEmail(users, user);
    const [recipientSnapshot, loading] = useCollection(db.collection('users').where('email', '==', recipientEmail))
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    function enterChat() {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {recipient ? <UserAvatar src={recipient?.photoUrl} /> : <UserAvatar />}
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat;
const Container = styled.div`
display: flex;
align-items: center;
gap: 10px;
&&& {
    cursor:pointer;
}
padding: 10px 15px;
word-break: break-word;
:hover {
    background-color: #e9eaeb;
}
`

const UserAvatar = styled(Avatar)`
margin-left: 10px;
`