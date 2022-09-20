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
    const correctSW = registrations.filter(
      (obj) => obj.active.scriptURL === obj.scope + 'firebase-messaging-sw.js',
    );
    if (correctSW.length > 0) {
      setIsRegisteredSW(true);
      console.log(`[DEBUG] Found correct ServiceWorker: ${correctSW}`);
    } else {
      setIsRegisteredSW(false);
    }
  } catch (error) {
    console.log('[DEBUG] Error getting registrations: ', error);
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
    console.log(`[DEBUG] Found token in localStorage: ${localStorage.getItem('fcm_token')}`);
  } else {
    setTokenFound(false);
    console.log('[DEBUG] No token found in localStorage');
  }
};

export const registerServiceWorker = async (setUpdated) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js', { scope: '/' })
      .then((registration) => {
        setUpdated(true);
        console.log('[DEBUG] Registration successful, scope is: ', registration.scope);
      })
      .catch((err) => {
        console.log('[DEBUG] Service worker registration failed, error: ', err);
      });
  }
};

export const fetchToken = async (setUpdated) => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: vapidKey });
    if (currentToken) {
      console.log('[DEBUG] current token for client: ', currentToken);
      updateFCMtokenLocalStorage(currentToken);
      // setTokenFound(true);
      // setToken(currentToken);
      setUpdated(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('[DEBUG] No registration token available. Request permission to generate one.');
      // setTokenFound(false);
      // shows on the UI that permission is required
    }
  } catch (err) {
    // catch error while creating client token
    console.log('[DEBUG] An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const updateFCMtokenLocalStorage = async (token) => {
  if (!localStorage.getItem('fcm_token')) {
    localStorage.setItem('fcm_token', token);
    console.log(`[DEBUG] Stored FCM token: ${token}`);
    return;
  }
  if (localStorage.getItem('fcm_token') !== token) {
    localStorage.setItem('fcm_token', token);
    console.log(`[DEBUG] Updated FCM token: ${token}`);
    return;
  }
  if (localStorage.getItem('fcm_token') === token) {
    console.log('[DEBUG] Token already up to date');
  }
};
