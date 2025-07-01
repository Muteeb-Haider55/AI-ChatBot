import { useState, useRef, useEffect } from "react";
import ChatbotIcon from "./components/Chatboticon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyinfo } from "./companyinfo";

const App = () => {
  // Initialize chat history with data from localStorage
  const [chatHistory, setChatHistory] = useState(() => {
    const savedChat = localStorage.getItem("chatHistory");
    return savedChat
      ? JSON.parse(savedChat)
      : [{ hideInChat: true, role: "model", text: companyinfo }];
  });

  const [showChatBot, setShowChatBot] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // Minimized state
  const chatBodyRef = useRef();

  // Function to generate bot's response
  const generateBotResponse = async (history) => {
    // Format chat history for API request
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong!");
      }

      const botResponse = data.candidates[0].content.parts[0].text;

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

  // Auto scroll when chat history updates
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // Store chat history in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Toggle minimize state
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
        {/* Chatbot header */}
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
                  Hey There how can I
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
