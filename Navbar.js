import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DehazeIcon from "@mui/icons-material/Dehaze";
import DTLogo from "../../Home-page/HomeImages/200x68_Dark.png";
import "../../Home-page/navTab.css";
import userimg from "../../Home-page/HomeImages/abc.png";
import DTLogoLight from "../../Home-page/HomeImages/200x68_Light.png";
import { Link } from "react-router-dom";
import { useTheme } from "../../../Features/DarkMode/ThemeContext";
import ThemeSwitcher from "../../../Features/DarkMode/ThemeSwitcher";
import _http from "../../../Api/_http";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

export default function Navbartab() {
  const [currentUser, setCurrentUser] = useState();
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    _http
      .get("/api/api_overview")
      .then(function (res) {
        setCurrentUser(true);
      })
      .catch(function (error) {
        setCurrentUser(false);
      });
  }, []);

  function submitLogout() {
    // _http.post("/logout",).then(function (res) {
    //   setCurrentUser(false);
    //   navigate("/Login");
    // });
    setCurrentUser(false);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem("key");
    navigate("/Login");
  }
  useEffect(() => {
    const name = sessionStorage.getItem('Name');

    const fetchImageFromAPI = () => {
      _http
        .post('/api/view_img', { username: name }, { responseType: 'arraybuffer' })
        .then((response) => {
          if (response.data) {
            const arrayBuffer = response.data;
            const blob = new Blob([arrayBuffer], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setUserImage(imageUrl);
            localStorage.setItem('userImage', imageUrl);
          }
        })
        .catch((error) => {
          console.error('Error fetching user image: ', error);
        });
    };

    // Fetch the user image from the API and store it in userImage
    fetchImageFromAPI();

    // Check if userImage is already stored in localStorage
    const cachedImageUrl = localStorage.getItem('userImage');
    if (cachedImageUrl) {
      setUserImage(cachedImageUrl);
    }
  }, []);

  const { theme } = useTheme();

  return (
    <>
      <nav
        className={` main-nav-tab navbar navbar-expand-lg ${theme === "dark" ? "dark-header" : "light-header"
          } `}
      >
        <div className=" container">
          <Link to="/Home" className="navbar-brand dtSkill-logo ">
            <img
              src={theme === "dark" ? DTLogoLight : DTLogo}
              // src={DTLogo}
              alt="img"
            />
          </Link>

          <button
            className="navbar-toggler custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className={`${theme === "dark" ? "dark-text" : ""
                } navbar-toggler-icon`}
            >
              <DehazeIcon />
            </span>
          </button>

          <div
            className={`collapse navbar-collapse ${theme === "dark" ? "dark-dropdown " : " light-dropdown  "
              }`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <Link className="nav-link fs-5 mx-3 " to="/Home">
                  Home
                </Link>
              </li>

              <li className="nav-item ">
                <Link className="nav-link fs-5 mx-3" to="/History">
                  History
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link fs-5 mx-3" to="/Tools">
                  Tools
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5 mx-3 " to="/DisplayBookmark">
                  Bookmarks
                </Link>
              </li>
            </ul>
            <div>
              <Link to="/Settings">
                <img
                  src={userImage}
                  // src={localStorage.getItem("userImage")}
                  className=" nav-user-img mx-4 "
                  height={45}
                  width={45}
                  alt="profil pic"
                />
              </Link>
            </div>
            <ThemeSwitcher />
            <div className="buttons">
              {currentUser && (
                <button
                  onClick={submitLogout}
                  style={{
                    height: "100%",
                    backgroundColor: "#d80621",
                    color: "white",
                  }}
                  className="btn mx-2"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
