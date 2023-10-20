import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
    const user = {
        loggedIn: sessionStorage.getItem("key") === "UserLogedIN",
    };
    return user && user.loggedIn;
};

const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoutes;

import React, { useState, useEffect } from "react";
// import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../src/Components/pages/login-register/Login";
import Register from "../src/Components/pages/login-register/Register";
import Home from "./Components/pages/Home-page/Home";
import ChatLayout from "./Components/pages/pdf-Pages/chatLayout/ChatLayout";
import TeacherAssist from "./Components/pages/pdf-Pages/TeacherAssist/TeacherAssist";
import ResumeParser from "./Components/pages/pdf-Pages/resumeParser/ResumeParser";
import StudentAssist from "./Components/pages/pdf-Pages/StudentAssist/StudentAssist";
import BioWriter from "../src/Components/pages/chat-pages/BioWriter";
import SummarizeContent from "../src/Components/pages/chat-pages/SummarizeContent";
import SimplyfiyContent from "../src/Components/pages/chat-pages/SimplyfiyContent";
import RewriteContent from "../src/Components/pages/chat-pages/RewriteContent";
import HomepageDescription from "../src/Components/pages/chat-pages/HomepageDescription";
import MetaDataDiscription from "../src/Components/pages/chat-pages/MetaDataDiscription";
import ProductDetailsDiscription from "../src/Components/pages/chat-pages/ProductDetailsDiscription";
import Navbar from "./Components/pages/Home-page/Nav/Navbartab";
import NavbarController from "./Components/pages/Home-page/NavbarController"; // Import the NavbarController component
import History from "../src/Components/pages/Home-page/Nav/History";
import Tools from "../src/Components/pages/Home-page/Nav/Tools";
import DisplayBookmark from "../src/Components/pages/Home-page/Bookmark/DisplayBookmark";
import BookmarkPdfDisplay from "../src/Components/pages/Home-page/Bookmark/BookmarkPdfDisplay";
import BookmarkPdfChatSection from "./Components/pages/Home-page/Bookmark/BookmarkPdfChatSection";
import NotFound from "../src/Components/pages/NotFound";
import EmailVerify from "../src/Components/pages/login-register/EmailVerify";
import PasswordReset from "./Components/pages/login-register/PasswordReset";
// import GoogleLogin from "./Components/pages/login-register/GoogleLogin";
import { useTheme } from "../src/Components/Features/DarkMode/ThemeContext";
import NotAccess from "./Components/pages/NotAccess";
import { useUserData } from "../src/Components/pages/login-register/UserDataProvider";
import MainLoading from "./Components/Features/DarkMode/MainLoading";
import Settings from "./Components/pages/Home-page/Nav/Settings";
import _http from "./Components/Api/_http";
import ProtectedRoutes from "./Components/Auth/ProtectedRoutes";
function App() {
  const { theme } = useTheme();
  const [dataFetched, setDataFetched] = useState(false);
  const { updateResponseData } = useUserData();
  const { responseData } = useUserData();
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("key") === "UserLogedIN";

    if (isLoggedIn && !responseData) {
      const fetchData = async (name) => {
        try {
          const response = await _http.post(
            "/api/user_app",
            { username: name }
          );
          const responseData = response.data[0];
          setIsLoading(false); // Set isLoading to false when data is fetched
          updateResponseData(responseData); // Update the data in the context
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false); // Set isLoading to false even on error
        }
      };
      const username = sessionStorage.getItem("Name");
      if (!dataFetched) {

        fetchData(username, updateResponseData);
        setDataFetched(true);
      }
    } else {
      setIsLoading(false); // If not logged in or data is already available, set isLoading to false
    }
  }, [responseData, updateResponseData]);

  // Render the loading message if isLoading is true
  // if (isloading) {
  //   return <MainLoading />
  // }
  // const j = localStorage.getItem("jwtToken")
  // const r = localStorage.getItem("refreshToken")
  // if (j === "null" || r === "null") {
  //   alert("login plz")
  //   return
  // }


  return (
    <div className={`${theme === 'dark' ? 'dark-theme' : ''} ${theme === 'dark' ? 'text-white' : 'text-dark'} `}>
      <Router>
        <NavbarController allowedPaths={["/Login", "/Register", "/PasswordReset", "/EmailVerify"]} > <Navbar />
        </NavbarController>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/EmailVerify" element={<EmailVerify />} />
          <Route path="/PasswordReset" element={<PasswordReset />} />
          <Route path="/Register" element={<Register />} />
          {/* <Route path="/" element={<GoogleLogin />} /> */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/History" element={<History />} />
            <Route path="/Tools" element={<Tools />} />
            <Route path="/DisplayBookmark" element={<DisplayBookmark />} />
            <Route path="/NotFound" element={<NotAccess />} />
            <Route path="/DisplayBookmark" element={<DisplayBookmark />} />
            <Route path="/Settings" element={<Settings />} />
            <Route exact path="/BookmarkPdfDisplay" element={<BookmarkPdfDisplay />} />
            <Route exact path="/BookmarkPdfChatSection" element={<BookmarkPdfChatSection />} />
            <Route path="/ChatLayout" element={responseData && responseData["Chatpdf"] ?
              (<ChatLayout />) : (<NotAccess />)} />
            <Route
              path="/StudentAssist"
              element={
                responseData && responseData["Studentassist"] ? (
                  <StudentAssist />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/TeacherAssist"
              element={
                responseData && responseData["Teacherassist"] ? (
                  <TeacherAssist />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/ResumeParser"
              element={
                responseData && responseData["Resumeparser"] ? (
                  <ResumeParser />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/BioWriter"
              element={
                responseData && responseData["Biowritter"] ? (
                  <BioWriter />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/SummarizeContent"
              element={
                responseData && responseData["Summarize_content"] ? (
                  <SummarizeContent />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/SimplyfiyContent"
              element={
                responseData && responseData["simplify_content"] ? (
                  <SimplyfiyContent />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/RewriteContent"
              element={
                responseData && responseData["Rewrite_content"] ? (
                  <RewriteContent />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/HomepageDescription"
              element={
                responseData && responseData["Homepage_desc"] ? (
                  <HomepageDescription />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/ProductDetailDescription"
              element={
                responseData && responseData["Product_details"] ? (
                  <ProductDetailsDiscription />
                ) : (
                  <NotAccess />
                )
              }
            />
            <Route
              path="/MetaDataDescription"
              element={
                responseData && responseData["MetaData_desc"] ? (
                  <MetaDataDiscription />
                ) : (
                  <NotAccess />
                )
              }
            /></Route>

        </Routes>

      </Router>
    </div>

  );
}

export default App;
