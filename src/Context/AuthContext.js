import React, { useState, useEffect } from "react";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [userIsTemp, setUserIsTemp] = useState(false);

  useEffect(() => {
    // if (document.cookie) {
    fetch(process.env.REACT_APP_PORT_SERVER + "/auth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 204) {
          return false;
        } else if (res.status === 200) {
          return res.json();
        }
      })
      .then((res) => {
        if (res) {
          // console.log(res.data[0]);
          setUserIsTemp(res.status === "temp" ? true : false);
          setUser(res);
        }
      })
      .catch((err) => console.log(err));
    // }
  }, []);

  const login = (data) => {
    fetch(`${process.env.REACT_APP_PORT_SERVER}/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log(res);
          return false;
        }
      })
      .then((res) => {
        if (res) {
          return setUser(res);
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  const register = (data) => {
    fetch(`${process.env.REACT_APP_PORT_SERVER}/register`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          console.log("Error saving account.");
          return false;
        }
      })
      .then((res) => {
        res && setUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, userIsTemp, setUserIsTemp }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);
export { AuthProvider, useAuth };
