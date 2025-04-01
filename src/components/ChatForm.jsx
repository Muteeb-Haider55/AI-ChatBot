import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return; // Don't proceed if the message is empty
    inputRef.current.value = ""; // Clear the input field

    // Update chat history with the user's message
    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];
    setChatHistory(updatedHistory);

    // Delay 600 ms before showing "Thinking..." and generating the bot's response
    setTimeout(() => {
      // Add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking ... " },
      ]);

      // Call the function to generate the bot's response
      generateBotResponse(updatedHistory);
    }, 700);
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="message ..."
        required
        className="messag-input"
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
