import React, { useRef, useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// import { useChat } from "../Context/ChatContext";
// import { useSocket } from "../Context/SocketContext";
import { useAuth } from "../Context/AuthContext";

export default function LogInScreen() {
  // let history = useHistory();
  const { login, register, setUser, userIsTemp, setUserIsTemp } = useAuth();
  // const { createContactsList } = useChat();
  // const { startSocketConnection } = useSocket();
  const usernameRef = useRef();
  // const emailRef = useRef();
  const passwordRef = useRef();
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  // const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  // const [userExists, setUserExists] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  // const [passwordLabel, setPasswordLabel] = useState("");

  // const asyncStart = async (userObj) => {
  //   await setUser(userObj);
  //   await createContactsList(userObj.connections);
  //   await startSocketConnection(userObj);
  //   history.push("/chat");
  // };

  const handleUsername = (e) => {
    e.preventDefault();
    const username = usernameRef.current["username"].value;
    setUsernameInput(username);
    // console.log(username);

    fetch(`${process.env.REACT_APP_PORT_SERVER}/login/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setShowUsernameInput(false);
          setShowPasswordInput(true);
          console.log("User exists.");
          return false; //~~ No temporary user created.
        } else if (res.status === 201) {
          setUserIsTemp(true);
          return res.json(); //~~ Return temporary user object.
        }
      })
      .then((res) => {
        if (res) {
          setUser(res);
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePassword = (e) => {
    e.preventDefault();
    const data = {
      username: usernameInput,
      password: passwordRef.current["password"].value,
    };
    login(data);
    // setShowPasswordInput(false);
  };

  const goBack = () => {
    setShowPasswordInput(false);
    setShowUsernameInput(true);
  };

  return (
    <div className="login-screen">
      <h1 className="app-title">port</h1>
      <form
        ref={usernameRef}
        className={`login-input ${
          showUsernameInput ? "show-login-input" : "hide-login-input"
        }`}
        onSubmit={handleUsername}
      >
        <input name="username" placeholder="Username" required></input>
      </form>

      <form
        ref={passwordRef}
        className={`login-input later-input ${
          showPasswordInput ? "show-login-input" : "hide-login-input"
        }`}
        onSubmit={handlePassword}
      >
        <p className="material-icons go-back" onClick={goBack}>
          keyboard_backspace
        </p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        ></input>
      </form>

      {/* <form
        ref={emailRef}
        className={`login-input later-input ${
          showEmailInput ? "show-login-input" : "hide-login-input"
        }`}
        onSubmit={registerUser}
      >
        <p className="go-back" onClick={goBack}>
          {"<"}
        </p>
        <input
          type="email"
          name="email"
          // required
        ></input>
        <p>email</p>
      </form> */}
    </div>
  );
}
