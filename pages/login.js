import styled from 'styled-components';
import Head from 'next/head';
import logo from '../public/images/whatsapp-logo.png';
import { Button } from '@mui/material';
import { auth, provider } from '../firebase';

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  }
  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo src={logo.src} />
        <Button variant="outlined" onClick={signIn}>Sign In With Google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login;
const Container = styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color: whitesmoke;



`;
const LoginContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 100px;
background-color: #fff;
border-radius: 5px;
box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.7);
`;
const Logo = styled.img`
  height: 100px;
  width: 120px;
  margin-bottom: 50px;
`;