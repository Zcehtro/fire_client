import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from './firebaseconfig';

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

const vapidKey =
  'BMVp5v-J11aQURqPK1blgEQNi6rcuqPA-TpMWWkxkdWa2PC2aPj4FN8afeZUcgMdnVH1LClFFaYCs3NtWFASJu0';

export const checkRegistrationSW = async (setIsRegisteredSW) => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.filter((worker) => worker.scope === 'http://localhost:3000/').length > 0) {
      setIsRegisteredSW(true);
    } else {
      setIsRegisteredSW(false);
    }
  } catch (error) {
    console.log('Error getting registrations: ', error);
  }
};

export const checkNotificationsEnabled = async (setIsNotificationsEnabled) => {
  if (Notification.permission === 'granted') {
    setIsNotificationsEnabled(true);
  } else {
    setIsNotificationsEnabled(false);
  }
};

export const checkTokenFound = (setTokenFound, setToken) => {
  if (localStorage.getItem('fcm_token')) {
    setTokenFound(true);
    setToken(localStorage.getItem('fcm_token'));
  } else {
    setTokenFound(false);
  }
};

export const registerServiceWorker = async (setUpdated) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js', { scope: '/' })
      .then((registration) => {
        setUpdated(true);
        console.log('Registration successful, scope is: ', registration.scope);

      })
      .catch((err) => {
        console.log('Service worker registration failed, error: ', err);
      });
  }
};

export const fetchToken = async (setUpdated) => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: vapidKey });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      localStorage.setItem('fcm_token', currentToken);
      // setTokenFound(true);
      // setToken(currentToken);
      setUpdated(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      // setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (err) {
    // catch error while creating client token
    console.log('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
