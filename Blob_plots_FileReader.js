import React, { useRef, useEffect, useState } from "react";
import "./ChatLayout.css";
import NewLoder from "../../Features/Loadings/NewLoder";
import { useTheme } from "../../Features/DarkMode/ThemeContext";
import _http from "../../Utils/Api/_http";
import UnderStandButtonPdf from "../../Features/UnderStandButtonPdf";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import uploadIcon from "../../Assets/Vector.svg";
import closemainSidebar from "../../Assets/group1.svg";
import openmainSidebar from "../../Assets/group2.svg";
import openSidebar from "../../Assets/Group 1151.svg";
import { selectIsSidebarOn } from "../../Redux/ReduceSidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  selectIsToggleOn,
  selectIsMainSidebarOn,
  toggleMainSidebar,
} from "../../Redux/ReduceSidebar";
import FileViewer from "react-file-viewer";
import PdfViewer from "../../Pages/Interact-With-File/ChatWith/PdfViewer";
import { InlineMath } from "react-katex";
import { Tooltip } from "react-tooltip";
import SnackBar from "../../Features/SnackBar";
import ChatSectionPlots from "../ChatSection/ChatPlots";
import JSZip from "jszip";

const ChatPlots = (props) => {
  const {
    appName,
    type,
    sliceNumber,
    fileType,
    apiSummary,
    apiQuestion,
    modalContent,
    accept,
    maxsize,
  } = props;
  const fileInputRef = useRef(null);
  const [pdfDataList, setPdfDataList] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState(null);
  const [pdfSize, setPdfSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAns, setIsLoadingAns] = useState(false);
  const [chatHistories, setChatHistories] = useState({});
  const [pdfUploadPer, setPdfUploadPer] = useState(0);
  const [pageInfoData, setPageInfoData] = useState("");
  const [minimizePdfView, setMinimizePdfView] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const isSideBar = useSelector(selectIsSidebarOn);
  const isToggleOn = useSelector(selectIsToggleOn);
  const isMainSidebarOn = useSelector(selectIsMainSidebarOn);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const [texContent, setTexContent] = useState(null);
  const [open, setOpen] = useState({
    error: false,
    Allowedfile: false,
    selectedfile: false,
  });
  const [fileName, setFileName] = useState("");
  const [errors, setError] = useState("");
  const [tokens, setTokens] = useState({
    prompt_tokens: "",
    completion_tokens: "",
    total_tokens: "",
  });

  const handleClose = () => {
    setOpen({ error: false, Allowedfile: false, selectedfile: false });
  };

  const handelMnimizePdf = () => {
    setMinimizePdfView(!minimizePdfView);
  };

  useEffect(() => {
    setPageInfoData(appName);
  }, [appName]);

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setPdfUploadPer(0);

    const files = event.target.files;

    if (!files || files.length === 0) {
      alert("Select one or more files.");
      return;
    }

    const maxSize = maxsize * 1024 * 1024;
    let allFilesValid = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.name.slice(-sliceNumber) !== fileType) {
        setFileName(file.name);
        setOpen({ Allowedfile: true });
        allFilesValid = false;
        break;
      }

      let fileIsPresent = pdfDataList.find((item) => item.name === file.name);
      if (fileIsPresent || fileIsPresent !== undefined) {
        setFileName(file.name);
        setOpen({ selectedfile: true });
        return;
      }

      if (file.size > maxSize) {
        setPdfSize(`File ${file.name} exceeds the size limit( ${maxSize}MB).`);
        allFilesValid = false;
        break;
      }
    }

    if (!allFilesValid) {
      return;
    }

    setIsLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (appName === "Chat TEX") {
        const content = await readFile(file);
        setTexContent(content);
      }
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await _http.post(`/api/${apiSummary}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setPdfUploadPer(percentCompleted);
          },
        });

        const prompt_tokens =
          response?.data?.prompt_tokens || "No prompt_tokens ";
        const completion_tokens =
          response?.data?.completion_tokens || "No completion_tokens";
        const total_tokens = response?.data?.total_tokens || "No total_tokens";

        setTokens((prevTokens) => ({
          ...prevTokens,
          prompt_tokens,
          completion_tokens,
          total_tokens,
        }));

        const pdfUrl = URL.createObjectURL(file);
        const pdfName = file.name;
        const pdfId = Date.now().toString();
        const chatMessage = {
          author: "bot",
          type: "text",
          data: { text: response.data.ai_answer },
        };
        const newPdf = {
          id: pdfId,
          url: pdfUrl,
          name: pdfName,
          chat: [],
          file: file,
        };
        setPdfDataList((prevList) => [newPdf, ...prevList]);
        setSelectedPdfId(pdfId);

        setChatHistories((prevHistories) => ({
          ...prevHistories,
          [pdfId]: [chatMessage],
        }));

        setMessage(chatMessage);
      } catch (error) {
        setOpen({ error: true });
        if (error.response && error.response.status === 500) {
          setError("Internal server error");
        } else {
          setError(error.message || "An error occured");
        }
      } finally {
        setIsLoading(false);
        setPdfUploadPer(0);

        const file = files[0];
        const filename = file.name.slice(0, 20);
        const filesize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        const currentTimeUTC = new Date().toISOString();

        const options = {
          hour12: false,
          timeZone: "UTC",
          timeZoneName: "short",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };

        const currentTime = new Date(currentTimeUTC).toLocaleString(
          "en-US",
          options
        );
        const userName = sessionStorage.getItem("Name");

        const newLog = {
          currentTime,
          userName,
          application: appName,
          filename,
          filesize,
        };

        let storedLogs = JSON.parse(localStorage.getItem("UserLogsArray"));

        if (!Array.isArray(storedLogs) || !storedLogs.length) {
          storedLogs = [];
        }

        storedLogs.unshift(newLog);

        localStorage.setItem("UserLogsArray", JSON.stringify(storedLogs));
      }
    }

    setIsLoading(false);
    event.target.value = null;
  };

  const handlePdfSelect = (pdfId) => {
    setSelectedPdfId(pdfId);
  };

  const handlePdfDelete = (pdfId) => {
    const updatedPdfDataList = pdfDataList.filter(
      (pdfDataItem) => pdfDataItem.id !== pdfId
    );
    setPdfDataList(updatedPdfDataList);
  };

  useEffect(() => {
    const selectedPdfExists = pdfDataList.some(
      (pdfDataItem) => pdfDataItem.id === selectedPdfId
    );

    if (!selectedPdfExists && pdfDataList.length > 0) {
      const nextPdfId = pdfDataList[0].id;
      setSelectedPdfId(nextPdfId);
    }
  }, [pdfDataList, selectedPdfId]);

  const updateChat = async (userInput) => {
    setIsLoadingAns(true);
    const userMessage = {
      author: "user",
      type: "text",
      data: { text: userInput },
    };

    setChatHistories((prevHistories) => ({
      ...prevHistories,
      [selectedPdfId]: [...(prevHistories[selectedPdfId] || []), userMessage],
    }));

    const selectedPdfData = pdfDataList.find(
      (pdfData) => pdfData.id === selectedPdfId
    );

    if (!selectedPdfData) {
      setIsLoadingAns(false);
      return;
    }

    const file = selectedPdfData.file;
    const question = userInput.toString();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    try {
      const response = await _http.post(`/api/${apiQuestion}`, formData, {
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const contentType = response.headers["content-type"];

      if (contentType === "application/zip") {
        console.log("inside application/zip ");
        console.log(response.data, "response.data inside zip ");
        try {
          const zip = new JSZip();
          const zipFiles = await zip.loadAsync(response.data);
          const images = [];

          for (const fileName in zipFiles.files) {
            const file = zipFiles.files[fileName];
            if (!file.dir) {
              const imageData = await file.async("base64");
              images.push({
                name: fileName,
                data: `data:image/png;base64,${imageData}`,
              });
            }
          }

          const botMessageObj = {
            author: "bot",
            type: "images",
            data: { images },
          };

          setChatHistories((prevHistories) => ({
            ...prevHistories,
            [selectedPdfId]: [
              ...(prevHistories[selectedPdfId] || []),
              botMessageObj,
            ],
          }));

          setMessage({ ...botMessageObj, pdfId: selectedPdfId });
        } catch (error) {
          console.error("Error processing ZIP file:", error);
          alert(
            "Error: Corrupted ZIP file or missing bytes. Please try again."
          );
        }
      } else if (contentType === "application/json") {
        console.log("inside application/json");
        console.log(response, "response for json");
        console.log(response.data, "response.data for json");

        const reader = new FileReader();

        reader.onload = function (event) {
          const jsonResponse = JSON.parse(event.target.result);

          console.log(jsonResponse, " JSON data from the response");

          const botmessage = jsonResponse?.ai_answer || "No results";
          const prompt_tokens =
            jsonResponse?.prompt_tokens || "No prompt_tokens ";
          const completion_tokens =
            jsonResponse?.completion_tokens || "No completion_tokens";
          const total_tokens = jsonResponse?.total_tokens || "No total_tokens";

          setTokens((prevTokens) => ({
            ...prevTokens,
            prompt_tokens,
            completion_tokens,
            total_tokens,
          }));

          const botMessage = {
            author: "bot",
            type: "text",
            data: { text: botmessage },
          };
          setChatHistories((prevHistories) => ({
            ...prevHistories,
            [selectedPdfId]: [
              ...(prevHistories[selectedPdfId] || []),
              botMessage,
            ],
          }));

          setMessage({ ...botMessage, pdfId: selectedPdfId });
        };

        reader.readAsText(response.data);
      } else {
        console.log("Content-Type: 3", contentType);
        alert("response type is wrong");
      }

      setIsLoadingAns(false);
    } catch (error) {
      setOpen({ error: true });
      if (error.response && error.response.status === 500) {
        setError("Internal server error");
      } else {
        setError(error.message || "An error occurred");
      }
      setIsLoadingAns(false);
    }
  };

  const updateChatHistories = (newChatHistories) => {
    setChatHistories(newChatHistories);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);
    setIsDragOver(false);
  };

  const CloseSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="containerr">
      <div
        className={`
        ${isSideBar ? "sidebar" : "hideSideBar"} 
        ${theme === "dark" ? "sidebar-dark-border " : "sidebar-light-border "} 
        ${theme === "dark" ? "" : "light-background"} `}
      >
        {isToggleOn && pdfDataList.length > 0 && (
          <div className="arrow">
            <img
              src={!isMainSidebarOn ? openmainSidebar : closemainSidebar}
              alt="icon"
              className={
                isMainSidebarOn ? "open-mainsidebar" : "close-mainsidebar"
              }
              data-tooltip-id="tooltip-arrow"
              data-tooltip-content={
                isMainSidebarOn ? "Close Sidebar" : "Open Sidebar"
              }
              onClick={() => {
                dispatch(toggleMainSidebar());
              }}
            />
          </div>
        )}

        <div className="heading-containerr">
          {" "}
          <div className="page-info-headingg">{appName}</div>
          {pdfDataList.length === 0 ? (
            <div className="description-boxx">
              <UnderStandButtonPdf modalContent={modalContent} />
            </div>
          ) : (
            <div
              onClick={CloseSidebar}
              data-tooltip-id="tooltip-arrow"
              data-tooltip-content={"Close"}
            >
              <img style={{ height: "21px" }} src={openSidebar} alt="icon" />
            </div>
          )}
        </div>

        <div>
          <div>
            <button
              className={`${
                theme === "dark" ? "newLight-border" : "newDark-border"
              } 
              ${theme === "dark" ? "dark-background" : "light-background"}
              newchat-button`}
              onClick={handleFileUpload}
            >
              + New Chat
            </button>
            <div className="or-line">
              <hr />
              <p>or</p>
              <hr />
            </div>
            <div
              className={`drag-drop-input ${isDragOver ? "drag-over" : ""} ${
                theme === "dark" ? "dark-background" : "light-background"
              } `}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileUpload}
            >
              <img src={uploadIcon} className="mx-2" alt="icon" />
              <p>
                Drag and drop or <br />{" "}
                {`Upload a ${type} file (max ${maxsize}MB)`}
              </p>
            </div>

            <div className="pdf-sizeError">{pdfSize}</div>
          </div>
          <>
            <input
              type="file"
              accept={accept}
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple
            />
            {
              <SnackBar
                message={`The file name ${fileName} already exists.`}
                severity="info"
                Open={open.selectedfile}
                handleClose={handleClose}
              />
            }
            {
              <SnackBar
                message={`File ${fileName} is not supported. Only ${accept} file is allowed.`}
                severity="info"
                Open={open.Allowedfile}
                handleClose={handleClose}
              />
            }{" "}
            {
              <SnackBar
                message={errors}
                severity={"error"}
                handleClose={handleClose}
                Open={open.error}
              />
            }
          </>
          {isLoading && (
            <div className="pdf-Uploaded progress">
              <div
                className={`${
                  theme === "dark" ? "dark-button  " : "light-button "
                } progress-bar`}
                role="progressbar"
                aria-valuenow={pdfUploadPer}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${pdfUploadPer}% ` }}
              >
                {pdfUploadPer}%{" "}
              </div>
            </div>
          )}
          <div style={{ height: "calc(100vh - 370px)", overflow: "auto" }}>
            <div className="uploaded-pdfs">
              {pdfDataList.map((pdfData) => (
                <div key={pdfData.id} className="uploaded-pdf">
                  <div className="pdf-info">
                    <div
                      className={`uploaded-pdf-button ${
                        pdfData.id === selectedPdfId
                          ? `${
                              theme === "dark"
                                ? "selected-pdf-button-dark "
                                : "selected-pdf-button-light "
                            }`
                          : null
                      } `}
                      onClick={() => handlePdfSelect(pdfData.id)}
                      title={pdfData.name}
                    >
                      <div style={{ width: "90%", overflow: "auto" }}>
                        {" "}
                        {pdfData.name}
                      </div>
                      <button
                        className="delete-pdf-button"
                        onClick={() => handlePdfDelete(pdfData.id)}
                        title="Delete PDF"
                      >
                        <DeleteOutlineIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loader">
          {" "}
          <NewLoder />{" "}
        </div>
      ) : (
        <div style={{ display: "flex" }} className="pdf-output">
          <div>
            {!isSideBar && pdfDataList.length > 0 && (
              <div className="heading-containerr1">
                <div onClick={() => dispatch(toggleSidebar())}>
                  <img
                    style={{ height: "21px" }}
                    src={openSidebar}
                    alt="icon"
                    data-tooltip-id="tooltip-arrow"
                    data-tooltip-content={"Open File Uploader"}
                  />
                </div>
                <div className="page-info-headingg">{appName}</div>
              </div>
            )}
            <div className={isSideBar ? "pdf-viewer" : "pdf-viewer1"}>
              {pdfDataList.map(
                (pdfData, i) =>
                  pdfData.id === selectedPdfId && (
                    <span style={{ height: "inherit" }} key={i}>
                      {appName === "Chat PDF" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                        />
                      )}
                      {appName === "Resume Parser" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                        />
                      )}
                      {appName === "Student Assist" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                        />
                      )}
                      {appName === "Chat DOCX" && (
                        <div
                          key={pdfData.id}
                          style={{
                            height: "inherit",
                            width: "100%",
                          }}
                          className={`${
                            theme === "dark" ? "light-text" : " "
                          } `}
                        >
                          <FileViewer
                            style={{ overflow: "auto", height: "100%" }}
                            fileType="docx"
                            filePath={pdfData.url}
                          />
                        </div>
                      )}
                      {appName === "Chat With CSV" && (
                        <div
                          key={pdfData.id}
                          style={{
                            height: "inherit",
                            width: "100%",
                          }}
                          className={`${theme === "dark" ? "light-text" : " "}`}
                        >
                          <PdfViewer url={pdfData.url} fileType="csv" />
                        </div>
                      )}
                      {appName === "Chat DB" && (
                        <div
                          key={pdfData.id}
                          style={{
                            height: "inherit",
                            width: "100%",
                          }}
                          className={`${
                            theme === "dark" ? "light-text" : " "
                          } `}
                        >
                          <PdfViewer url={pdfData.url} fileType="xlsx" />
                        </div>
                      )}
                      {appName === "Chat with JS" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                        />
                      )}
                      {appName === "Chat JSON" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                          className={`${
                            theme === "dark" ? "light-theme" : " "
                          } `}
                        />
                      )}
                      {appName === "Chat With Log" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                          className={`${
                            theme === "dark" ? "light-theme" : " "
                          } `}
                        />
                      )}
                      {appName === "Chat MD" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                          className={`${
                            theme === "dark" ? "light-theme" : " "
                          } `}
                        />
                      )}
                      {appName === "Chat PPTX" && (
                        <div
                          key={pdfData.id}
                          style={{
                            height: "inherit",
                            width: "100%",
                          }}
                        >
                          <FileViewer
                            fileType="pptx"
                            filePath={pdfData.url}
                            style={{ overflow: "auto", height: "100%" }}
                          />
                        </div>
                      )}
                      {appName === "Chat With PY" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                        />
                      )}
                      {appName === "Chat TEX" && (
                        <div
                          key={pdfData.id}
                          style={{
                            overflow: "scroll",
                            height: "100%",
                          }}
                          className={`${
                            theme === "dark" ? "dark-text" : "light-text"
                          } `}
                        >
                          {texContent && (
                            <div className="tex-viewer">
                              {/* <BlockMath>{texContent}</BlockMath> */}

                              <InlineMath>{texContent}</InlineMath>
                            </div>
                          )}
                        </div>
                      )}
                      {appName === "Chat With TXT" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                          className={`${
                            theme === "dark" ? "light-theme" : " "
                          } `}
                        />
                      )}
                      {appName === "Chat XLSX" && (
                        <div
                          key={pdfData.id}
                          style={{
                            height: "inherit",
                            width: "100%",
                          }}
                          className={`${
                            theme === "dark" ? "light-text" : " "
                          } `}
                        >
                          <PdfViewer url={pdfData.url} fileType="xlsx" />
                        </div>
                      )}
                      {appName === "Chat XML" && (
                        <embed
                          key={pdfData.id}
                          src={pdfData.url}
                          width="100%"
                          height="100%"
                          type="application/pdf"
                          className={`${
                            theme === "dark" ? "light-theme" : " "
                          } `}
                        />
                      )}
                      {/* {appName === "Chat With Image" && (
                                            <embed
                                                key={pdfData.id}
                                                src={pdfData.url}
                                                width="100%"
                                                height="100%"
                                                type="application/pdf"
                                            />
                                        )} */}
                    </span>
                  )
              )}
            </div>
          </div>
          <div style={{ height: "inherit", minWidth: "calc(100% - 450px)" }}>
            {pdfDataList.map(
              (pdfData) =>
                pdfData.id === selectedPdfId && (
                  <ChatSectionPlots
                    key={pdfData.id}
                    pdfData={pdfData}
                    message={message}
                    updateChat={updateChat}
                    onChatUpdate={updateChat}
                    chatHistories={chatHistories}
                    uniqueIdentifier={pdfData.id}
                    updateChatHistories={updateChatHistories}
                    isLoadingAns={isLoadingAns}
                    pageInfoData={pageInfoData}
                    handelMnimizePdf={handelMnimizePdf}
                    tpromptTokens={tokens.prompt_tokens}
                    completionTokens={tokens.completion_tokens}
                    totalTokens={tokens.total_tokens}
                    pdfName={pdfData.name}
                  />
                )
            )}
          </div>
        </div>
      )}
      <Tooltip
        id="tooltip-arrow"
        place="bottom"
        style={{ fontSize: "16px", padding: "7px" }}
      />
    </div>
  );
};

export default ChatPlots;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect, useRef } from "react";
import "./ChatSection.css";
import SendIconLight from "../../Assets/ChatSectionImages/Send.svg";
import SendIconDark from "../../Assets/ChatSectionImages/dark-send.svg";
import FileSaver from "file-saver";
import { useTheme } from "../../Features/DarkMode/ThemeContext";
import _http from "./../../Utils/Api/_http";
import boxsizeIcon from "../../Assets/ChatSectionImages/boxsizeIcon.svg";
import bookmarkIcon from "../../Assets/ChatSectionImages/bookmarkIcon.svg";
import resetIcon from "../../Assets/ChatSectionImages/resetIcon.svg";
import deleteIcon from "../../Assets/ChatSectionImages/deleteIcon.svg";
import shareIcon from "../../Assets/ChatSectionImages/shareIcon.svg";
import exportIcon from "../../Assets/ChatSectionImages/exportIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import { selectIsSidebarOn, toggleSidebar } from "../../Redux/ReduceSidebar";
import expandIcon from "../../Assets/ChatSectionImages/expandIcon.svg";
import wandIcon from "../../Assets//ChatSectionImages/wandIcon.svg";
import quesMark from "../../Assets/ChatSectionImages/quesMark.svg";
import picIcon from "../../Assets/ChatSectionImages/picIcon.svg";
import linkIcon from "../../Assets/ChatSectionImages/linkIcon.svg";
import lineIcon1 from "../../Assets/ChatSectionImages/lineIcon1.svg";
import lineIcon from "../../Assets/ChatSectionImages/lineIcon.svg";
import info from "../../Assets/ChatSectionImages/info.png";
import { Tooltip } from "react-tooltip";
import SnackBar from "../../Features/SnackBar";

const ChatSectionPlots = ({
  pdfData,
  chatHistories,
  updateChat,
  uniqueIdentifier,
  updateChatHistories,
  isLoadingAns,
  pageInfoData,
  tpromptTokens,
  completionTokens,
  totalTokens,
}) => {
  const chatHistory =
    pdfData.id in chatHistories ? chatHistories[pdfData.id] : [];
  const [messages, setMessages] = useState(pdfData.chat);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  var name = sessionStorage.getItem("Name");
  const [MainWriteContainer, setMainWriteContainer] = useState(true);
  const isSideBar = useSelector(selectIsSidebarOn);
  const [errors, setError] = useState("");
  const [isBookmmark, setIsBookmark] = useState(false);
  const [isShareChat, setIsSharechat] = useState(false);
  const [open, setOpen] = useState({
    Bookmark: false,
    Copy: false,
    error: false,
    description: false,
  });
  const dispatch = useDispatch();
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };
  {
    isLoadingAns && scrollToBottom();
  }
  useEffect(() => {
    if (chatHistories && chatHistories.pdfId === uniqueIdentifier) {
      setMessages((prevList) => [...prevList, chatHistories]);
    }
    scrollToBottom();
  }, [chatHistories, uniqueIdentifier]);

  const handleResetChat = () => {
    const botMessage = {
      author: "bot",
      type: "text",
      data: { text: "Welcome to our website! How can I assist you today?" },
    };

    updateChatHistories({
      ...chatHistories,
      [pdfData.id]: [botMessage],
    });

    setMessages([botMessage]);
  };

  const handleDeleteChat = () => {
    setMessages([]);
    if (pdfData.id in chatHistories) {
      chatHistories[pdfData.id] = [];
    }
  };

  const handleUserMessage = () => {
    if (userInput.trim() === "") return;

    const newMessage = {
      author: "user",
      type: "text",
      data: { text: userInput },
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setUserInput("");
    updateChat(userInput);

    scrollToBottom();
  };

  const handleExportChat = () => {
    const chatContent = chatHistory.map((message) => `${message.data.text}\n`);
    const blob = new Blob([chatContent], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, "chat.txt");

    const fileUrl = URL.createObjectURL(blob);
    setUrl(fileUrl);
  };

  const handleShareChat = () => {
    const chatContent = chatHistory.map((message) => `${message.data.text}\n`);
    const blob = new Blob([chatContent], {
      type: "text/plain;charset=utf-8",
    });

    const fileUrl = URL.createObjectURL(blob);
    setUrl(fileUrl);
  };

  const handleBookmarkChat = async () => {
    if (description.trim() === "") {
      setOpen({ description: true });
    } else {
      const chatContent = chatHistory.map(
        (message) => `${message.data.text}\n`
      );
      const chatBlob = new Blob([chatContent], {
        type: "text/plain;charset=utf-8",
      });
      const chatFile = new File([chatBlob], "chat.txt");

      try {
        const formData = new FormData();
        formData.append("id", Math.random().toString(36).substring(2));
        formData.append("name", name);
        formData.append("description", description);
        formData.append("app_name", pageInfoData);
        formData.append("pdffile", pdfData.file);
        formData.append("chatfile", chatFile);
        await _http.post("/api/postbookmark", formData);

        setOpen({ Bookmark: true });
        setIsBookmark(false);
      } catch (error) {
        setOpen({ error: true });
        if (error.response && error.response.status === 500) {
          setError("Internal Server Error");
        } else {
          setError(error.message);
        }
        setIsBookmark(false);
      }
    }
  };

  const descriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const toggleChatBar = () => {
    setMainWriteContainer(!MainWriteContainer);
    isSideBar && dispatch(toggleSidebar());
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setOpen({ Copy: true });
      setIsSharechat(false);
    } catch (error) {
      setOpen({ error: true });
      console.error("Error copying to clipboard:", error);
      setIsSharechat(false);
    }
  };
  const handleClose = (state) => {
    setOpen({ ...state, open: false });
  };
  const { theme } = useTheme();
  return (
    <div className={`chat-section  ${theme === "dark" ? "dark-header" : ""}`}>
      <div
        className={`heading-containerr2  ${
          theme === "dark" ? "dark-theme" : "light-background"
        }`}
      >
        <img
          src={boxsizeIcon}
          alt="icon"
          className={MainWriteContainer ? "open-compose" : "close-compose"}
          onClick={toggleChatBar}
          data-tooltip-id="tooltip-chatsection"
          data-tooltip-content={MainWriteContainer ? "Open Chat" : "Close Chat"}
          data-tooltip-delay-show={1000}
        ></img>
      </div>

      <div className="chat-sec-box">
        <div style={{ Height: "inherit", minWidth: "50%", flexGrow: "1" }}>
          <div
            className={`chat-header ${
              theme === "dark" ? "dark-header" : "light-header"
            } ${theme === "dark" ? "dark-border" : ""} `}
          >
            {" "}
            <div
              className={`page-info-heading ${
                theme === "dark" ? "dark-text" : "light-text"
              } `}
              style={{ margin: "0px" }}
            >
              <button
                className={`black-hover-issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } boxSixe`}
              ></button>
              <p className="chat-box-heading">Chat Box</p>
            </div>
            <div className={`chat-actions`}>
              <button
                className={`${
                  theme === "dark" ? "btn-bookmark-dark" : "btn-bookmark-light"
                } black - hover - issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } `}
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setIsBookmark(true)}
              >
                {/* Bookmark */}
                <img
                  src={bookmarkIcon}
                  alt="bookmark"
                  data-tooltip-id="tooltip-chatsection"
                  data-tooltip-content="Bookmark"
                  data-tooltip-delay-show={1000}
                ></img>
              </button>

              <div
                className="bookmark-model"
                style={{ display: !isBookmmark ? "none" : "" }}
              >
                <div
                  className="modal"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Add Description !!!
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <textarea
                          className="modal-textarea"
                          rows={3}
                          cols={3}
                          placeholder="Here ..."
                          onChange={descriptionChange}
                        ></textarea>
                      </div>
                      <div className="modal-footer">
                        <button
                          onClick={handleBookmarkChat}
                          className="btn btn-danger"
                        >
                          Add
                        </button>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!isBookmmark && open.Bookmark && (
                <SnackBar
                  message={"Added to My AI Projects"}
                  severity={"success"}
                  handleClose={handleClose}
                  Open={open.Bookmark}
                />
              )}
              {!isBookmmark && open.error && (
                <SnackBar
                  message={errors}
                  severity={"error"}
                  handleClose={handleClose}
                  Open={open.error}
                />
              )}
              {!isShareChat && open.description && (
                <SnackBar
                  message={"Please add Description"}
                  severity={"warning"}
                  handleClose={handleClose}
                  Open={open.description}
                />
              )}
              <button
                className={`black-hover-issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } `}
                onClick={handleResetChat}
              >
                {/* Reset */}
                <img
                  src={resetIcon}
                  alt="reset"
                  data-tooltip-id="tooltip-chatsection"
                  data-tooltip-content="Reset Chat"
                  data-tooltip-delay-show={1000}
                ></img>
              </button>
              <button
                className={`black-hover-issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } `}
                onClick={handleDeleteChat}
              >
                {/* Delete */}
                <img
                  src={deleteIcon}
                  alt="delete"
                  data-tooltip-id="tooltip-chatsection"
                  data-tooltip-content="Delete"
                  data-tooltip-delay-show={1000}
                ></img>
              </button>
              <button
                className={`black-hover-issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } `}
                onClick={handleExportChat}
              >
                {/* Export */}
                <img
                  src={exportIcon}
                  alt="export"
                  data-tooltip-id="tooltip-chatsection"
                  data-tooltip-content="Export Chat"
                  data-tooltip-delay-show={1000}
                ></img>
              </button>
              <div
                className={`dropdown black-hover-issue ${
                  theme === "dark" ? "dark-text" : "light-text"
                } `}
                onClick={() => setIsSharechat(true)}
              >
                <button
                  type="button"
                  className={`black-hover-issue ${
                    theme === "dark" ? "dark-text" : "light-text"
                  } `}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal3"
                  onClick={handleShareChat}
                >
                  {/* <button
                  className={`black-hover-issue ${theme === "dark" ? "dark-text" : "light-text"
                    } `}
                > */}
                  {/* Share */}
                  <img
                    src={shareIcon}
                    alt="share"
                    data-tooltip-id="tooltip-chatsection"
                    data-tooltip-delay-show={1000}
                    data-tooltip-content="Share Chat"
                  ></img>
                </button>
                <div style={{ display: !isShareChat ? "none" : "" }}>
                  <div
                    className="modal fade"
                    id="exampleModal3"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h3
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Copy Url
                          </h3>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">{url}</div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={handleCopy}
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!isShareChat && open.error && (
            <SnackBar
              message={"Error in copying"}
              severity={"error"}
              handleClose={handleClose}
              Open={open.copyerror}
            />
          )}
          {!isShareChat && open.Copy && (
            <SnackBar
              message={"Url link copied!"}
              severity={"success"}
              handleClose={handleClose}
              Open={open.Copy}
            />
          )}
          <div
            className={`chat-messages  ${
              theme === "dark" ? "dark-background" : ""
            }`}
          >
            <span className="pdf-name">{pdfData.name}</span>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.author === "user"
                    ? `${
                        theme === "dark"
                          ? "user-message-dark"
                          : "user-message-light"
                      }`
                    : "bot-message"
                }`}
                style={{
                  marginBottom: message.author === "user" ? "" : "10px",
                }}
              >
                <div className="msg-content" style={{ width: "100%" }}>
                  <span className="token-button dropdown">
                    <span
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <img style={{ height: "20px" }} src={info} alt="" />
                    </span>

                    <div
                      style={{ minWidth: "14rem", padding: "5px" }}
                      className="dropdown-menu dropdown-menu-right logout-dropdown  "
                      aria-labelledby="navbarDropdown"
                    >
                      <p>Prompt Tokens: {tpromptTokens}</p>
                      <p>Completion Tokens: {completionTokens}</p>
                      <p>Total Tokens: {totalTokens}</p>
                    </div>
                  </span>
                  {message.type === "text" && <div>{message.data.text}</div>}
                  {message.type === "images" && (
                    <div>
                      {message.data.images.map((image, i) => (
                        <img
                          className="scatter-image-csv"
                          key={i}
                          src={image.data}
                          alt={image.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef}>
              {isLoadingAns && (
                <div style={{ margin: "20px" }} className="loader-gpt"></div>
              )}
            </div>
          </div>

          <div className={`user-input   `}>
            <input
              className={` ${
                theme === "dark" ? "dark-background" : "light-background"
              } 
              ${theme === "dark" ? "dark-text" : "light-text"}`}
              type="text"
              placeholder="Type your questions...  "
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter" && !isLoadingAns) {
                  handleUserMessage();
                }
              }}
            />

            <button
              disabled={isLoadingAns}
              className="send-button"
              onClick={handleUserMessage}
            >
              <img
                src={theme === "dark" ? SendIconDark : SendIconLight}
                alt="icon"
              />
            </button>
          </div>
        </div>
        <div
          className={
            MainWriteContainer || isSideBar
              ? "hide-main-write-container"
              : "main-write-container"
          }
        >
          <div
            className={`write-container ${
              theme === "dark" ? "dark-theme" : "light-background"
            } `}
          >
            <div className="text-area-container">
              <img
                src={expandIcon}
                style={{ position: "absolute", translate: ".5rem .8rem" }}
                alt="icon"
              />
              <textarea
                className={` ${theme === "dark" ? "dark-background" : ""} ${
                  theme === "dark" ? "dark-text" : "light-text"
                }
              `}
                placeholder="Compose something..."
              ></textarea>

              <div className="ques">
                <p>?</p>
              </div>
            </div>
            <div className="other-write-tools-container">
              <div className="tool1">
                <button className={`${theme === "dark" ? "dark-theme" : ""}`}>
                  <img
                    style={{ padding: "0 3px" }}
                    src={wandIcon}
                    alt="icon"
                  ></img>
                  Continue Writing
                </button>
              </div>
              <div className="tool2">
                <img src={quesMark} alt="icon"></img>
              </div>
              <div className="tool3">
                <img src={lineIcon1} alt="icon"></img>
              </div>
              <div className="tool4">
                <img src={lineIcon} alt="icon"></img>
              </div>
              <div className="tool5">
                <img src={linkIcon} alt="icon"></img>
              </div>
              <div className="tool6">
                <img src={picIcon} alt="icon"></img>
              </div>
              <div className="tool7">0 Words</div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="tooltip-chatsection" place="bottom" />
    </div>
  );
};

export default ChatSectionPlots;
