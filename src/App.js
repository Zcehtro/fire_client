import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { fetchToken, registerServiceWorker } from './firebase';

function App() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    registerServiceWorker();
  }, [token]);

  useEffect(() => {
    const tokenFunc = async () => {
      const data = await fetchToken(setTokenFound, setToken);
      return data;
    };

    tokenFunc();
  }, [setTokenFound]);




  const messageShowNotification = async (payload) => {
    const { title, body } = payload.notification;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, { body });

      console.log('[DEBUG] messageShowNotification() Notification send', payload.notification);
    } catch (err) {
      console.log('[DEBUG] catch block:50 ', err.message);
    }
  };

  //? Handlers Calls Begin
  const handleShowNotification = () => {
    const notification = { title: 'Notification', body: 'This is a test notification... ' };
    messageShowNotification({ notification });
  };

  return (
    <div className="App">
      <header className="App-header">
        {isTokenFound && (
          <div>
            <h1> Notification permission enabled 👍🏻 </h1>
            <h2> Token:</h2>
            <h6>{token}</h6>
          </div>
        )}
        {!isTokenFound && <h1> Need notification permission ❗️ </h1>}
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => handleShowNotification()}>Show Toast</button>
      </header>
    </div>
  );
}

export default App;
