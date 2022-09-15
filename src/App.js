import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { fetchToken, onMessageListener } from "./firebase";

function App() {
  const [isTokenFound, setTokenFound] = useState(false);
  const [token, setToken] = useState("");

  fetchToken(setTokenFound, setToken);

  onMessageListener()
    .then((payload) => {
      new Notification(payload.notification.title, { body: payload.notification.body });
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  const onShowNotificationClicked = () => {
    new Notification("Notification", { body: "This is a test notification... " });
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
