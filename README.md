# Push notification demo for desktop web browser, Android and iOS

- [Push notification demo for desktop web browser, Android and iOS](#push-notification-demo-for-desktop-web-browser-android-and-ios)
  - [Main goal](#main-goal)
  - [Roadmap](#roadmap)
  - [References used](#references-used)
    - [Main project tutorial](#main-project-tutorial)
    - [Other references](#other-references)

## Main goal

This project's main goal is to implement a working push notification system for desktop web browser, Android and iOS.

Most tutorials cover only the Firebase v8 SDK, which is now being deprecated. So this project is to work out the basics to implement the code for Firebase v9 SDK.

Similarly, most tutorials only cover the use of Firebase Cloud Messaging (FCM) for Web on desktop, but not for Android and iOS. This project is also to work out the basics implementing said functionality.

The final goal is to have the project fully functional on all platforms, installed and working as a Progressive Web App (PWA).

As of the time of this writing, Apple has yet to implement Push Notification for Safari on iOS (only MacOS has this enabled so far). Said functionality is expected to be released as a patch in iOS 16, which is expected to be released sometime in 2023.

## Roadmap

- [x] Work out the basics of the project to use code for Firebase v9 SDK
- [X] Enable settings in Firebase console
- [X] Enable notifications in desktop web browser
- [X] Enable push notifications in desktop web browser
- [X] Enable notifications in Android
- [X] Enable push notifications in Android
- [ ] Enable notifications in iOS
- [ ] Enable push notifications in iOS
- [ ] Enable PWA functionality

## References used

### Main project tutorial

[Push notifications with React and Firebase
](https://blog.logrocket.com/push-notifications-react-firebase/)

### Other references

[How to add push notifications to a web app with Firebase ?+?
](https://www.freecodecamp.org/news/how-to-add-push-notifications-to-a-web-app-with-firebase-528a702e13e1/)

[ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)

[Using async/await with service worker](https://stackoverflow.com/questions/59620213/using-async-await-with-service-worker)

[Show push notifications in React | FCM notifications in React](https://www.youtube.com/watch?v=rqBh4YP_CwM)

[Set up a JavaScript Firebase Cloud Messaging client app](https://firebase.google.com/docs/cloud-messaging/js/client)
