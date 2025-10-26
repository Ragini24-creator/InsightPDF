import React, { useState, useEffect, useRef } from "react";
import ChatWindow from './UI/ChatWindow'
import PdfUpload from "./UI/PdfUpload";
import PdfViewer from "./UI/PdfViewer";
import { createSession, getChatHistory, sendQuery, clearChatHistory } from './Utils/HelperMethods'
import "./App.css";


function App() {
  const [messages, setMessages] = useState([{ role: "bot", text: "📄 Ready to chat! Upload a PDF and let’s explore it together." },]);
  const [sessionId, setSessionId] = useState(null);
  const [inputText, setInputText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [enableChat, setEnableChat] = useState(false)

  const pdfRef = useRef(null);

  const handleGoToPage = (pageNum) => {
    pdfRef.current?.goToPage(pageNum);
  };

  const handleEnablingChat = (state) => {
    setEnableChat(state);
  }

  // Handle Side Effects (usually for tasks to perform after website reloads)
  useEffect(() => {
    async function setup() {
      let existingSessionId = localStorage.getItem("sessionId");

      if (!existingSessionId) {
        const { newSessionId, history } = await createSession();
        setSessionId(newSessionId);
        setMessages(history);
      } else {
        // set existing sessionId in state for global use
        setSessionId(existingSessionId);

        // get chat history associated with this sessionId
        const response = await getChatHistory(existingSessionId);
        setMessages(response.history);
      }
    }

    setup();
  }, []); //eslint

  // Handle Usr Query Processing Logic
  const handleSend = async (text) => {
    if (!text.trim()) return;

    // show user message immediately
    setMessages((prev) => [...prev, { role: "user", text }]);

    // set loading → show typing indicator
    setLoading(true);

    try {
      const { answer, citations } = await sendQuery(sessionId, text);
      // add bot response
      setMessages((prev) => [...prev, { role: "bot", text: answer, citations: citations }]);

    } catch (error) {
      console.error("Error sending query:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Something went wrong." },]);

    } finally {
      setLoading(false);
    }
  };

  // Handle Session Reset Logic
  const handleReset = async function () {
    const wasSessionReset = await clearChatHistory(sessionId);

    if (wasSessionReset) {
      setMessages([]);
      window.location.reload();
      setEnableChat(false);
      setMessages((prev) => [...prev, { role: "bot", text: "📄 Ready to chat! Upload a PDF and let’s explore it together." },]);
      alert('Your session has been reset!')
    }
    else {
      alert('Failed to reset session!')
    }
  }


  return (
    <div className="container">
      <div className="left-panel">
        <PdfUpload onUpload={setFile} onSuccessfulUpload={handleEnablingChat} />

        <ChatWindow messages={messages} isLoading={loading} onGoToPage={handleGoToPage} />


        {/* Input area with Send button */}
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            disabled={!enableChat}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputText.trim() !== "") {
                handleSend(inputText.trim());
                setInputText("");
              }
            }}
          />

          {/* Send Button */}
          <button
            className="send-btn"
            disabled={!enableChat}
            onClick={() => {
              if (inputText.trim() !== "") {
                handleSend(inputText.trim());
                setInputText("");
              }
            }}
          >
            Send
          </button>
        </div>

        {/* Reset Session Button */}
        <button className="clear-session-btn" onClick={handleReset}>
          Reset Session
        </button>

      </div>

      <div className="right-panel">
        {file && <PdfViewer file={file} ref={pdfRef} />}
      </div>

    </div>

  );
}

export default App;
