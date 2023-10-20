import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoOfDt from "../Home-page/HomeImages/200x68_Dark.png";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from '../../Features/DarkMode/ThemeContext'
import DTLogoLight from '../Home-page/HomeImages/200x68_Light.png'
import _http from "../../Api/_http";

export default function PasswordReset() {
    const { theme } = useTheme();
    const [newPassword, setNewPassword] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("");
        }, 1500);

        return () => clearTimeout(timer);
    }, [message]);

    useEffect(() => {

        const tokenFromLocation = location.state?.token || ""; // Get the currentUserName from location state

        setToken(tokenFromLocation); // Set the userName state
    }, [location.state]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    useEffect(() => {
        const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
        setValidPwd(PWD_REGEX.test(newPassword));
    }, [newPassword]);

    async function handlePasswordReset(e) {
        e.preventDefault();

        const v = PWD_REGEX.test(newPassword);

        if (!v) {
            setMessage("Check Entry Fields");
            return;
        } else if (newPassword === "") {
            setMessage("Check Input Fields");
            return;
        }

        try {
            const res = await _http.post(
                `/reset_password/${token}/${username}/`,

                {
                    new_password: newPassword,
                }
            );
            console.log("Taken new Password.", res.data);

            if (res.data.bool) {
                setMessage(
                    "Password reset successful! Please Login again with new Password"
                );
                console.log("Password reset successful!");

                setTimeout(() => {
                    navigate("/Login");
                }, 1500);
            } else {
                setMessage("Password reset failed.");
                console.log("Password reset failed!");
            }
        } catch (error) {
            console.error("Password reset failed due to some issue:", error);
            setMessage("Some Issue Occured");
        }
    }
    return (

        <div className="login-body" >
            <div class="login-card">
                <div class="login-logo title">
                    <img
                        src={theme === 'dark' ? DTLogoLight : logoOfDt}
                        alt="img"
                    />
                </div>
                <div class="title">
                    <h3>Password Reset</h3>
                </div>


                {message && (
                    <div className="alert alert-info" role="alert">
                        {message}
                    </div>
                )}

                <form className="login-card-form">
                    <div class="email-login">
                        <label for="email">
                            {" "}
                            <b>Username</b>
                        </label>


                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Enter Username"
                            value={username}
                            onChange={handleUsernameChange}
                            className="form-control form-control-lg"

                        />

                        <label for="psw">
                            <b>Password</b>
                        </label>
                        <input
                            type="passowrd"
                            name="password"
                            id="password"
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            className="form-control form-control-lg"
                            required
                        />
                    </div>
                    <p
                        id="pwdnote"
                        style={{
                            display:
                                newPassword.length > 0 && !validPwd
                                    ? "block"
                                    : "none",
                        }}
                        className={`alert alert-danger ${validPwd ? "offscreen" : "instructions"
                            }`}
                        role="alert"
                    >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.
                        <br />
                        Must include uppercase and lowercase letters, a
                        number, and a special character.
                        <br />
                        Allowed special characters:[!@#$%]
                    </p>

                    <button
                        onClick={(event) => {
                            handlePasswordReset(event);
                        }}
                        class="btn btn-danger   cta-btn"
                        type="button"
                    >
                        Reset
                    </button>
                </form>

            </div>
        </div>

    );
}
