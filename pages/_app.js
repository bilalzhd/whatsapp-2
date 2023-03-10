import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase.js';
import Login from './login';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import firebase from 'firebase';
import Head from 'next/head';
import styled from 'styled-components';

function MyApp({ Component, pageProps }) {
  const [ user, loading ] = useAuthState(auth);
  useEffect(() => {
    if(user){
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoUrl: user.photoURL,
        },
        { merge: true }
      )
    }
  }, [user])
  
  if(loading) return <Loading />
  if(!user) return <Login />

  return (<Container>
    <Head>
      <meta name='description' content='a whatsapp kind of clone built using next js with server side rendering and incremental site regeneration' />
    </Head>
    <Component {...pageProps} />
  </Container>)
}

export default MyApp;
const Container = styled.div`
max-height: 100vh;1`
