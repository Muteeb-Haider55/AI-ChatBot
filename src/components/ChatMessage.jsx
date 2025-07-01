import ChatbotIcon from "./ChatbotIcon";

// Helper to format text
const formatTextWithBold = (text) => {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong>$1</strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
};

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  const isBot = chat.role === "model";
  const formattedText = isBot ? formatTextWithBold(chat.text) : chat.text;

  return (
    <div className={`message ${isBot ? "bot" : "user"}-message`}>
      {isBot && <ChatbotIcon />}
      {isBot ? (
        <p
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      ) : (
        <p className="message-text">{formattedText}</p>
      )}
    </div>
  );
};

export default ChatMessage;
