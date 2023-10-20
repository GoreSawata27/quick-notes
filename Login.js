import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useTheme } from "../../Features/DarkMode/ThemeContext";
import { useUserData } from "./UserDataProvider";
import _http from "../../Api/_http";
import logoOfDt from "../Home-page/HomeImages/200x68_Dark.png";
import DTLogoLight from "../Home-page/HomeImages/200x68_Light.png";

const validateLoginInput = (username, password) => {
  if (username.length === 0 || password.length === 0) {
    return "Invalid Entry";
  }
  return null;
};

const fetchData = async (updateResponseData) => {
  try {
    const response = await _http.post("/api/user_app", { username: sessionStorage.getItem("Name") });
    const responseData = response.data[0];
    updateResponseData(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


export default function Login() {
  const [dataFetched, setDataFetched] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { updateResponseData } = useUserData();
  const client = axios.create({
    baseURL: "http://127.0.0.1:8000",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 1500);

    return () => clearTimeout(timer);
  }, [error]);

  const usernameChange = (event) => {
    setUsername(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const inputError = validateLoginInput(username, password);

    if (inputError) {
      setError(inputError);
      return;
    }

    try {
      const res = await client.post("/login", {
        username: username,
        password: password,
      });

      if (res.data.error) {
        setError(res.data.error);
        setCurrentUser(false);
      } else {
        setCurrentUser(true);
        localStorage.setItem("jwtToken", res.data.output.access_token);
        localStorage.setItem("refreshToken", res.data.output.refresh_token);
        setCurrentUser(true);
        sessionStorage.setItem("key", "UserLogedIN");
        sessionStorage.setItem("Name", res.data.output.user);
        sessionStorage.setItem("Email", res.data.output.email);

        if (!dataFetched) {
          fetchData(updateResponseData);
          setDataFetched(true);
        }
        navigate("/home");
      }
    } catch (error) {
      setCurrentUser(false);
      setError("Login failed");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-body">
      <div className="login-card">
        <div className="login-logo title">
          <img src={theme === "dark" ? DTLogoLight : logoOfDt} alt="img" />
        </div>
        <div className="title title-margin">
          <h3>Login</h3>
        </div>
        <div className="title">
          Don't have an account yet?
          <Link className="subtitle" to="/Register">
            Create an account
          </Link>
        </div>
        {currentUser ? (
          <div className="text-center mb-5">Login successful!</div>
        ) : (
          <form className="login-card-form">
            <div className="email-login">
              <label htmlFor="username">
                <b>Username</b>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={usernameChange}
                className="form-control form-control-lg"
                required
              />
              <label htmlFor="password">
                <b>Password</b>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={passwordChange}
                className="form-control form-control-lg"
                autoComplete="on"
                required
              />
            </div>
            {error && <span className="invalid-login-error">{error}</span>}
            <button onClick={handleLogin} className="btn btn-danger cta-btn" type="button">
              Login
            </button>
            <Link className="forget-pass" to="/EmailVerify">
              Forgot Password?
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
