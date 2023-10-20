import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoOfDt from "../Home-page/HomeImages/200x68_Dark.png";
import { useTheme } from '../../Features/DarkMode/ThemeContext'
import DTLogoLight from '../Home-page/HomeImages/200x68_Light.png'
import _http from "../../Api/_http";

export default function EmailVerify() {
    const { theme } = useTheme();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage("");
        }, 1500);

        return () => clearTimeout(timer);
    }, [message]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    async function handleEmailPasswordReset(e) {
        e.preventDefault();
        console.log(email + "Email entered");
        if (email === "") {
            setMessage("Please Enter Email");
            return;
        }

        try {
            const res = await _http.post(
                "/request_reset_password",
                { email }
            );
            console.log("Password reset request sent : ", res.data.token);
            setToken(res.data.token);

            if (res.data.token.length <= 0) {
                setMessage("Please Enter correct mail");
            }

            setMessage("Now you can reset your password");

            setTimeout(() => {
                navigate("/PasswordReset", { state: { token: res.data.token } });
            }, 1500);
        } catch (error) {
            console.log("Catch Error");
            setMessage("Please check entered email");
        }
    }
    return (
        <div className="e-verify-box">
            <div className="login-body">
                <div class="login-card">

                    <div class="login-logo title">
                        <img
                            src={theme === 'dark' ? DTLogoLight : logoOfDt}
                            alt="img" />
                    </div>
                    <div class="title">
                        <h3>Verify Email</h3>
                    </div>
                    <div class="title">
                        <form className="login-card-form">
                            <div class="email-login">
                                <label for="email">
                                    {" "}
                                    <b></b>
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className="form-control form-control-lg"
                                    required
                                />


                            </div>
                            <button
                                onClick={(event) => {
                                    handleEmailPasswordReset(event);
                                }}
                                class="btn btn-danger   cta-btn"
                                type="button"
                            >
                                Send Reset Link
                            </button>


                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
