import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';
import {
  checkNotificationsEnabled,
  checkRegistrationSW,
  checkTokenFound,
  fetchToken,
  onMessageListener,
  registerServiceWorker,
} from './firebase';

function App() {
  const [tokenFound, setTokenFound] = useState(false);
  const [token, setToken] = useState('');
  const [isRegisteredSW, setIsRegisteredSW] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [updated, setUpdated] = useState(false);

  //  checks at page load

  useEffect(() => {
    checkRegistrationSW(setIsRegisteredSW);
    checkNotificationsEnabled(setIsNotificationsEnabled);
    checkTokenFound(setTokenFound, setToken);
    setUpdated(false);

    console.log('[DEBUG] updated: ', updated);
  }, [updated]);

  // click handlers

  const handleRegisterServiceWorker = async () => {
    registerServiceWorker(setUpdated);
  };

  const handleRequestNotificationPermission = async () => {
    fetchToken(setUpdated);
  };

  const handleShowNotification = () => {
    const notification = {
      title: 'Toast',
      body: 'This is a test notification. Triggered by your browser, no data from server was received... ',
    };
    messageShowNotification({ notification });
  };

  const handlePrintTokenToConsole = () => {
    console.log('[DEBUG] token: ', token);
  };

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

  onMessageListener()
    .then((payload) => {
      messageShowNotification(payload);
      console.log(`[DEBUG] Message from Firebase: ${payload}`);
    })
    .catch((err) => console.log('failed: ', err));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Push notification demo for desktop web browser, Android and iOS</h1>
        <img src={logo} className="App-logo" alt="logo" />

        <div>
          <div className="div-main-buttons">
            <div className="flex">
              <button className="button-main" onClick={() => handleRegisterServiceWorker()}>
                Register Service Worker
              </button>
              <div className="flex flex-vertical">
                {isRegisteredSW && <p className="buttonSideLabel"> ✅ Service worker registered</p>}
                {!isRegisteredSW && (
                  <p className="buttonSideLabel"> ❌ Service worker is not registered</p>
                )}
              </div>
            </div>
            <div className="flex">
              <button className="button-main" onClick={() => handleRequestNotificationPermission()}>
                Request Permission for Notifications
              </button>
              <div className="flex flex-vertical">
                {isNotificationsEnabled && (
                  <p className="buttonSideLabel"> ✅ Notification permission enabled </p>
                )}
                {!isNotificationsEnabled && (
                  <p className="buttonSideLabel"> ❌ Need notification permission </p>
                )}
                {tokenFound && <p className="buttonSideLabel"> ✅ Token found </p>}
                {!tokenFound && <p className="buttonSideLabel"> ❌ Token not found </p>}
              </div>
            </div>
          </div>
        </div>
        {!tokenFound && isNotificationsEnabled && (
          <div>
            <h5> Firebase Token</h5>
            <p className="token-message">
              Token not found in Local Storage. Click the button above to fetch the token from
              Firebase.
            </p>
          </div>
        )}
        {!tokenFound && !isNotificationsEnabled && (
          <div>
            <h5> Firebase Token</h5>
            <p className="token-message">
              Register service worker and enable notifications in order to get Firebase Cloud
              Messaging token.
            </p>
          </div>
        )}
        {tokenFound && !isNotificationsEnabled && (
          <div>
            <h5> Firebase Token</h5>
            <p className="token-message">
              Firebase Token found, however notifications are not granted. It is likely that this
              token is outdated and/or expired.
            </p>
            <p className="token-message">Press button to grant notifications again.</p>
          </div>
        )}
        {tokenFound && isNotificationsEnabled && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              margin: '0, 10px',
            }}
          >
            <h5> Firebase Token</h5>
            <code className="code-box">{token}</code>
            <button className="buttonSmallStyle" onClick={() => handlePrintTokenToConsole()}>
              Print token to console
            </button>
            {!isRegisteredSW && (
              <p className="token-message">
                Register service worker in order to use notifications.
              </p>
            )}
            {isRegisteredSW && (
              <button className="button-main" onClick={() => handleShowNotification()}>
                Show Toast
              </button>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
