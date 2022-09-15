import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchToken, onMessageListener } from "./firebase";

function App() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [isTokenFound, setTokenFound] = useState(false);

  const [token, setToken] = useState("");
  const [isCbChecked, setIsCbChecked] = useState(false);

  fetchToken(setTokenFound, setToken);

  onMessageListener()
    .then((payload) => {
      if (isCbChecked) {
        setNotification({ title: payload.notification.title, body: payload.notification.body });
        setShow(true);
      } else {
        new Notification(payload.notification.title, { body: payload.notification.body });
      }
      console.log(payload);
    })
    .catch((err) => console.log("failed: ", err));

  const onShowNotificationClicked = () => {
    if (isCbChecked) {
      setNotification({ title: "Notification", body: "This is a test notification... " });
      setShow(true);
    } else {
      new Notification("Notification", { body: "This is a test notification... " });
    }
  };

  return (
    <div className="App">
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        animation
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          minWidth: 200,
        }}
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto">{notification.title}</strong>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
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
        <Button onClick={() => onShowNotificationClicked()}>Show Toast</Button>
        <Form.Check
          type={"checkbox"}
          label={`Enable React-Bootstrap Notification UI`}
          onClick={() => setIsCbChecked(!isCbChecked)}
        />
      </header>
    </div>
  );
}

export default App;
