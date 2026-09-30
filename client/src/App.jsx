import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ForgeAI 🤖</h1>

      <input
        type="text"
        placeholder="Ask ForgeAI something..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <h2>Response:</h2>

      <p>{reply}</p>
    </div>
  );
}

export default App;