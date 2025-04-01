import { useState, useRef, useEffect } from "react";
import ChatbotIcon from "./components/chatboticon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyinfo } from "./companyinfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyinfo,
    },
  ]);
  const [showChatBot, setShowChatBot] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // New state for minimized mode
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      // Make the API call to get the bot's response
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }

      // Extract the bot's response from the API data
      const botResponse = data.candidates[0].content.parts[0].text;

      // Update chat history: Remove "Thinking ..." and add the bot's response
      setChatHistory((prevHistory) => [
        ...prevHistory.filter((msg) => msg.text !== "Thinking ... "),
        { role: "model", text: botResponse },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prevHistory) => [
        ...prevHistory.filter((msg) => msg.text !== "Thinking ... "),
        {
          role: "model",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  useEffect(() => {
    // auto scroll whenever chat history update
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => {
          setShowChatBot((prev) => !prev);
          setIsMinimized(false); // Reset minimized state when toggling
        }}
        id="chatbot-toggler"
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className={`chatbot-popup ${isMinimized ? "minimized" : ""}`}>
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            className="material-symbols-rounded minimize-btn"
            onClick={toggleMinimize}
          >
            {isMinimized ? "keyboard_arrow_up" : "keyboard_arrow_down"}
          </button>
        </div>

        {/* Only show body and footer when not minimized */}
        {!isMinimized && (
          <>
            <div ref={chatBodyRef} className="chat-body">
              <div className="message bot-message">
                <ChatbotIcon />
                <p className="message-text">
                  Hey There how can
                  <br /> help you today 👏
                </p>
              </div>
              {/* Render the chat history dynamically */}
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            <div className="chat-footer">
              <ChatForm
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
                chatHistory={chatHistory}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
