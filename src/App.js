import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { fetchToken, onMessageListener, registerServiceWorker } from './firebase';

function App() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [token, setToken] = useState('');
  registerServiceWorker();

  fetchToken(setTokenFound, setToken);

  const messagePayload = async () => {
    try {
      const payload = await onMessageListener();
      console.log('Message received. ', payload);
      return payload;
      // Update a notification state with the new notification
    } catch (err) {
      console.log('Failed to receive payload: ', err);
    }
  };

  const messageShowNotification = async (payload) => {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
      });
      console.log('Notification shown.');
    } catch (err) {
      console.log('Failed to show notification after payload received: ', err);
    }
  };

  // onMessageListener()
  //   .then((payload) => {
  //     // new Notification(payload.notification.title, { body: payload.notification.body });
  //     ServiceWorkerRegistration.showNotification(payload.notification.title, {
  //       body: payload.notification.body,
  //     });
  //     console.log(payload);
  //   })
  //   .catch((err) => console.log('failed: ', err));

  const onShowNotificationClicked = () => {
    const payload = {
      notification: { title: 'Notification', body: 'This is a test notification... ' },
    };
    // new Notification("Notification", { body: "This is a test notification... " });
    messageShowNotification(payload);
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
        <button onClick={() => onShowNotificationClicked()}>Show Toast</button>
      </header>
    </div>
  );
}

export default App;
