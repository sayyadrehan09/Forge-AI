import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: chatId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      // Store chat ID
      setChatId(data.chatId);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong ❌",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ForgeAI 🤖</h1>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.role === "user" ? "You" : "ForgeAI"}:
            </strong>{" "}
            {msg.content}
          </div>
        ))}

        {loading && <p>ForgeAI is thinking...</p>}
      </div>

      <input
        type="text"
        placeholder="Ask ForgeAI something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default App;  