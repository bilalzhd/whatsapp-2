import Head from 'next/head'
import styled from 'styled-components'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp</title>
        <meta name="description" content="Whatsapp clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
      <Sidebar/>
      </Container>
    </div>
  )
}
const Container = styled.div`
`;
