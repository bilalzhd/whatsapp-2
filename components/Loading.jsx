import logo from '../public/images/whatsapp-logo.png';
import { Circle } from 'better-react-spinkit';
import Head from 'next/head';
function Loading() {
  return (
    <>
    <Head>
      <title>Loading...</title>
    </Head>
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div>
        <img src={logo.src} alt="whatsapp logo" height={200} width={240} style={{marginBottom: 10}} />
        <Circle color="#3CBC28" size={60}/>
      </div>
    </center>
    </>
  )
}

export default Loading;