import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from './firebaseconfig';

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Regsitration successful, scope is: ', registration.scope);
      })
      .catch((err) => {
        console.log('Service worker registration failed, error: ', err);
      });
  }
};

export const fetchToken = async (setTokenFound, setToken) => {
  let currentToken = '';

  try {
    currentToken = await getToken(messaging, {
      vapidKey:
        'BMVp5v-J11aQURqPK1blgEQNi6rcuqPA-TpMWWkxkdWa2PC2aPj4FN8afeZUcgMdnVH1LClFFaYCs3NtWFASJu0',
    });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      setToken(currentToken);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
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
