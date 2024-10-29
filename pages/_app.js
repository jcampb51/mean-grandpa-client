// pages/_app.js
import '../styles/globals.css';
import '../styles/workshop.css';
import { UserProvider } from '../context/userQueries';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
