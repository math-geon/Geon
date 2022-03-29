import { ConnectionHandler, LoadingScreen } from '../components/';
import { IProps } from '../interfaces';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function Geon({ Component, pageProps }: AppProps<IProps>): JSX.Element {
  const router = useRouter();
  return <div id="appContainer">
    <ConnectionHandler/>
    <LoadingScreen router={router}/>
    <Component {...pageProps}/>
  </div>;
}
