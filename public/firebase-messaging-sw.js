// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyB5HmEmykFxiPYOx6_D1VdLI8RDE3YCJ4o',
  authDomain: 'fire-client-bdeb3.firebaseapp.com',
  projectId: 'fire-client-bdeb3',
  storageBucket: 'fire-client-bdeb3.appspot.com',
  messagingSenderId: '1014212822062',
  appId: '1:1014212822062:web:409b9ce4faeebb165c4bbf',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
