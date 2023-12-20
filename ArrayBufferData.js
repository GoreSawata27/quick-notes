import React, { useState, useEffect, useRef } from "react";
import _http from "./../../Api/_http";
import dSendIcon from "./../../Assets/ChatSectionImages/dark-send.svg";
import SendIcon from "./../../Assets/ChatSectionImages/Send.svg";
import backimage from "./../../Assets/background-gpt.jpeg";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useTheme } from "./../../Features/DarkMode/ThemeContext";
import { useSelector } from "react-redux";
import { selectIsToggleOn } from "./../../Redux/ReduceSidebar";
import AttachFileTwoToneIcon from "@mui/icons-material/AttachFileTwoTone";
import deleteIcon from "../../Assets/ChatSectionImages/deleteIcon.svg";
import "./../GptPrompt/customPrompt.css";
import JSZip from "jszip";

const Zip = () => {
  const config = {
    loader: { load: ["input/asciimath"] },
    asciimath: {
      displaystyle: false,
      delimiters: [
        ["$", "$"],
        ["`", "`"],
      ],
    },
  };

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState([]);
  const [showInitialImage, setShowInitialImage] = useState(true);
  const [Cfile, setFile] = useState([]);
  const [fileName, setFileName] = useState("");
  const [hide, setHide] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const isToggleOn = useSelector(selectIsToggleOn);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const handleFileChange = async (e) => {
    setHide(true);
    const selectedFiles = e.target.files;
    const file = selectedFiles[0];
    const fileName = file.name;
    setFileName(fileName.slice(0, 10));
    setFile(selectedFiles);
    setLoading(true);
    setCurrentQuestion("");
    setLoadingQuestions([...loadingQuestions, true]);
    setShowInitialImage(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await _http.post("/api/csvdatasummary", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      addChatMessage(currentQuestion, response.data.ai_answer);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setLoadingQuestions((prevLoadingQuestions) =>
        prevLoadingQuestions.slice(1)
      );
    }
  };

  const handelDelete = () => {
    setFile([]);
    setHide(false);
  };

  const handleAsk = async () => {
    setHide(true);

    setLoading(true);
    setCurrentQuestion("");
    setLoadingQuestions([...loadingQuestions, true]);
    setShowInitialImage(false);

    try {
      const formData = new FormData();
      console.log(currentQuestion, " currentQuestion");
      formData.append("question", currentQuestion);
      if (Cfile.length > 0) {
        formData.append("file", Cfile[0]);
      } else {
        setHide(false);
        formData.append("file", null);
      }

      // const response = await _http.post("/api/datavisualise", formData);

      const response = await _http.post("/api/datavisualise", formData, {
        responseType: "blob", // Ensure the response is received as a Blob
      });

      if (response.data.ai_answer) {
        addChatMessage(currentQuestion, response.data?.ai_answer);
      } else {
        const zipFile = response.data; // Assuming the response is the zip file

        const zip = new JSZip();
        await zip.loadAsync(zipFile);

        const contents = [];

        await Promise.all(
          Object.keys(zip.files).map(async (fileName) => {
            const file = zip.files[fileName];
            const content = await file.async("base64");
            contents.push({
              name: fileName,
              content, // Store the actual image data
            });
          })
        );

        // Update chat messages with the extracted images
        console.log(contents, "contents");
        addChatMessage(currentQuestion, contents);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      const currentTime = new Date().toLocaleString("en-US", {
        timeZoneName: "short",
        hour12: true,
      });

      const file = Cfile[0];
      const filename = file?.name?.slice(0, 20);
      const filesize = `${(file?.size / (1024 * 1024)).toFixed(2)} MB`;

      const userName = sessionStorage.getItem("Name");

      const newLog = {
        currentTime,
        userName,
        application: "Custom Prompt",
        filename,
        filesize,
      };

      let storedLogs = JSON.parse(localStorage.getItem("UserLogsArray"));

      if (!Array.isArray(storedLogs) || !storedLogs.length) {
        storedLogs = [];
      }

      storedLogs.unshift(newLog);

      localStorage.setItem("UserLogsArray", JSON.stringify(storedLogs));

      setLoading(false);
      setLoadingQuestions((prevLoadingQuestions) =>
        prevLoadingQuestions.slice(1)
      );
    }
  };

  const addChatMessage = (question, answer) => {
    setChatMessages((prevMessages) => [...prevMessages, { question, answer }]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, currentQuestion]);

  return (
    <div className={`app-container ${!isToggleOn ? "max" : "min"} `}>
      <div
        className={`${
          theme === "dark" ? "dark-theme " : "light-background"
        } chat-area`}
      >
        <div className="chat-window">
          <span>
            {chatMessages.map((message, index) => (
              <div key={index} className="chat-message">
                <div
                  className={`question ${
                    theme === "dark"
                      ? "user-message-dark-gpt"
                      : "user-message-light-gpt"
                  }`}
                >
                  {message.question}
                </div>
                <div ref={messagesEndRef} className="answer">
                  {Array.isArray(message.answer) ? (
                    message.answer.map((imageData, i) => (
                      <div key={i}>
                        <img
                          src={`data:image/png;base64,${imageData.content}`}
                          alt={imageData.name}
                        />
                      </div>
                    ))
                  ) : // Render text or single image
                  message.answer.startsWith("data:image") ? (
                    <div>
                      <img src={message.answer} alt="image" />
                    </div>
                  ) : (
                    <MathJaxContext version={3} config={config}>
                      <MathJax hideUntilTypeset={"first"}>
                        <p style={{ margin: "0" }}>{message.answer}</p>
                      </MathJax>
                    </MathJaxContext>
                  )}
                </div>
              </div>
            ))}

            {showInitialImage && (
              <div className="gpt-image">
                <div>
                  <img src={backimage} alt="img" />
                </div>
                <div>
                  <h4>How can I help you today?</h4>
                </div>
              </div>
            )}
          </span>
          {loadingQuestions.length > 0 && (
            <div ref={messagesEndRef}>
              {/* {addChatMessage.map((file, index) => {
                <img key={index}
                  src={data:image/png;base64,${file.content}}
                  alt={file.name}
                  height="350px"
                  width="500px"
                />
              })} */}
              <span className="loader-gpt"></span>
            </div>
          )}
        </div>

        <div
          className={`${
            hide
              ? "custom-prompt-input-area-without-pdf"
              : "custom-prompt-input-area-with-pdf"
          }`}
        >
          {hide ? (
            <>
              <span className="file-name mx-2">
                {fileName}
                <button className="px-3" onClick={handelDelete}>
                  <img src={deleteIcon} alt="deleteIcon" />
                </button>
              </span>
            </>
          ) : null}
          <div className="input-wrapper">
            <div className="files-section">
              <label htmlFor="fileInput" style={{ display: "none" }}>
                <input
                  type="file"
                  id="fileInput"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept=".csv,"
                />
              </label>
              <button onClick={handleIconClick}>
                <AttachFileTwoToneIcon style={{ marginTop: "10px" }} />
              </button>
            </div>
            <input
              type="text"
              className={`${theme === "dark" ? "dark-text" : "light-text"} ${
                theme === "dark" ? "dark-background" : ""
              }`}
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Ask a question..."
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleAsk();
                }
              }}
            />
            <button onClick={handleAsk} disabled={loading}>
              {loading ? (
                <div className="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <img
                  src={`${theme === "dark" ? dSendIcon : SendIcon}`}
                  alt="img"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zip;
