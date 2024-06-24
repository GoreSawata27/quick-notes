import React, { useEffect, useRef, useState } from "react";
import "../ChatLayout.css";
import ChatSection from "../../ChatSection";
import axios from "axios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import Navbar from '../../Home-page/Navbartab'
import Loading from '../../../Features/Loading'

function ChatLayout() {
  const fileInputRef = useRef(null);
  const [pdfDataList, setPdfDataList] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState(null);
  const [pdfSize, setPdfSize] = useState('')
  const [isLoading, setisLoading] = useState(false)

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setisLoading(false);
    try {
      const selectedFile = event.target.files[0];

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setPdfSize("Selected PDF exceeds the size limit (10MB).")
        console.error("Selected PDF exceeds the size limit (10MB).");
        return;
      }
      setPdfSize("")
      uploadFile(selectedFile);
    } catch (error) {
      console.error("Error handling file change:", error);
    }
  };

  const uploadFile = async (file) => {
    setisLoading(true)
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/api/chat_pdf_summary",
        formData
      );

      const pdfUrl = URL.createObjectURL(file);
      const pdfName = file.name;
      const pdfId = Date.now().toString();
      const chatMessage = {
        author: "bot",
        type: "text",
        data: { text: response.data.output },
      };

      const newPdf = {
        id: pdfId,
        url: pdfUrl,
        name: pdfName,
        chat: [chatMessage],
      };

      // Update the PDF data list
      setPdfDataList((prevList) => [...prevList, newPdf]);

      // Set the selected PDF
      setisLoading(false);
      setSelectedPdfId(pdfId);
    } catch (error) {
      setisLoading(false);
      console.error("Error uploading file:", error);
    }
  };

  const handlePdfSelect = (pdfId) => {
    setSelectedPdfId(pdfId);
  };

  const handlePdfDelete = (pdfId) => {
    const updatedPdfDataList = pdfDataList.filter(
      (pdfDataItem) => pdfDataItem.id !== pdfId
    );
    setPdfDataList(updatedPdfDataList);

    if (selectedPdfId === pdfId) {
      const latestPdf = updatedPdfDataList[updatedPdfDataList.length - 1];
      setSelectedPdfId(latestPdf ? latestPdf.id : null);
    }
  };

  const updateChat = (userInput) => {
    setisLoading(true)
    axios
      .post(
        "http://127.0.0.1:8000/api/chatquestion",
        { userInput },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      )
      .then((response) => {
        const botmessage = response?.data?.ai_answer || "No results";
        const botResponse = {
          author: "bot",
          type: "text",
          data: { text: botmessage },
        };

        // Set the message state
        setisLoading(false);
        setMessage(botResponse);
      })
      .catch((error) => {
        setisLoading(false);
        console.error("Error updating chat:", error);
      });
  };



  return (
    <>
      <div>
        {/* <Navbar /> */}
      </div>
      <div className="containerr">

        <div className="sidebar">
          <div style={{ height: "64px", marginBottom: "15px", cursor: "pointer" }}>
            <button className="upload-button" onClick={handleFileUpload}>
              Upload PDF
            </button>
            <div className="pdf-sizeError">
              {pdfSize}
            </div>
          </div>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {isLoading ? (<div><Loading /></div>) : ''}

          <div className="uploaded-pdfs">
            {pdfDataList.map((pdfData) => (
              <div key={pdfData.id} className="uploaded-pdf">
                <div className="pdf-info">
                  <button
                    className={`uploaded-pdf-button ${pdfData.id === selectedPdfId ? "selected-pdf-button" : ""
                      }`}
                    onClick={() => handlePdfSelect(pdfData.id)}
                    title={pdfData.name}
                  >
                    {pdfData.name}
                  </button>
                  <button
                    className="delete-pdf-button"
                    onClick={() => handlePdfDelete(pdfData.id)}
                    title="Delete PDF"
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pdf-viewer">
          {pdfDataList.map((pdfData) => (
            pdfData.id === selectedPdfId && (
              <embed key={pdfData.id}
                src={pdfData.url}
                width="100%" height="100%"
                type="application/pdf"

                style={{
                  backgroundColor: 'white' // Limit the maximum height
                }}
              />
            )
          ))}
        </div>
        <div className="chat">
          {pdfDataList.map((pdfData) => (
            pdfData.id === selectedPdfId && (
              <ChatSection
                key={pdfData.id}
                pdfData={pdfData}
                message={message}
                onChatUpdate={(userInput) => {
                  updateChat(userInput);
                }}
              />
            )
          ))}
        </div>
      </div>
    </>
  );
}

export default ChatLayout;


