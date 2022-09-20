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

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#fff',
  borderRadius: '5px',
  color: '#555',
  display: 'block',
  width: '50vw',
  maxWidth: '500px',
  margin: '10px 0',
  fontSize: '1.5rem',
};

const buttonSideLabel = {
  padding: '0 0 0 10px',
  fontSize: '1.5rem',
  textAlign: 'left',
  verticalAlign: 'middle',
};

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

  const handleShowNotification = () => {
    const notification = {
      title: 'Toast',
      body: 'This is a test notification. Triggered by your browser, no data from server was received... ',
    };
    messageShowNotification({ notification });
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
          <div style={{ margin: '20px' }}>
            <div style={{ display: 'flex' }}>
              <button style={buttonStyle} onClick={() => handleRegisterServiceWorker()}>
                Register Service Worker
              </button>
              {isRegisteredSW && <p style={buttonSideLabel}> ✅ Service worker registered</p>}
              {!isRegisteredSW && (
                <p style={buttonSideLabel}> ❌ Service worker is not registered</p>
              )}
            </div>
            <div style={{ display: 'flex' }}>
              <button style={buttonStyle} onClick={() => handleRequestNotificationPermission()}>
                Request Permission for Notifications
              </button>
              {isNotificationsEnabled && (
                <p style={buttonSideLabel}> ✅ Notification permission enabled </p>
              )}
              {!isNotificationsEnabled && (
                <p style={buttonSideLabel}> ❌ Need notification permission </p>
              )}
            </div>
          </div>
          {!tokenFound && !isNotificationsEnabled && (
            <div>
              <h2 style={{ fontSize: '18px' }}> Firebase Token</h2>
              <p style={{ fontSize: '1.5rem' }}>
                Register service worker and enable notifications in order to get Firebase Cloud
                Messaging token.
              </p>
            </div>
          )}
          {tokenFound && !isNotificationsEnabled && (
            <div>
              <h2 style={{ fontSize: '18px' }}> Firebase Token</h2>
              <p style={{ fontSize: '1.5rem' }}>
                Firebase Token found, however notifications are not granted. It is likely that this
                token is outdated and/or expired.
              </p>
              <p style={{ fontSize: '1.5rem' }}>Press button to grant notifications again.</p>
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
              <h2 style={{ fontSize: '18px' }}> Firebase Token</h2>
              <code
                style={{
                  fontSize: '12px',
                  padding: '10px',
                  backgroundColor: '#888',
                  borderRadius: '5px',
                  color: '#eee',
                  width: '100%',
                }}
              >
                {token}
              </code>
              {!isRegisteredSW && (
                <p style={{ fontSize: '1.5rem' }}>
                  Register service worker in order to use notifications.
                </p>
              )}
              {isRegisteredSW && (
                <button style={buttonStyle} onClick={() => handleShowNotification()}>
                  Show Toast
                </button>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
