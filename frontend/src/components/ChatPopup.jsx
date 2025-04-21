import { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton, Avatar } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there 👋\nWelcome!\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    try {
      // 🌐 Call your real API here
      const res = await fetch("/api/ai/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await res.json();
  
      const aiMessage = {
        sender: "ai",
        text: data.reply || "No response received.",
      };
  
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI fetch failed", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Sorry, something went wrong." },
      ]);
    }
  };
  

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        {!open && (
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: "#3a3f4a",
              color: "white",
              "&:hover": { backgroundColor: "#c2185b" },
            }}
          >
            <ChatIcon />
          </IconButton>
        )}
      </Box>

      {/* Chat Panel */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 380,
            height: 500,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            zIndex: 10000,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #eee",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: "#3a3f4a" }}>
                V
              </Avatar>
              <Typography fontWeight="bold">Virtual Assistant</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages */}
          <Box
            ref={chatRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              backgroundColor: "#fafafa",
            }}
          >
            {messages.map((msg, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 1.5,
                  maxWidth: "85%",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "user" ? "#3a3f4a" : "white",
                  color: msg.sender === "user" ? "white" : "#333",
                  borderRadius: 2,
                  whiteSpace: "pre-line",
                }}
              >
                <Typography fontSize="0.9rem">{msg.text}</Typography>
              </Paper>
            ))}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <Box display="flex" flexDirection="column" gap={1}>
                {[
                  "What can this assistant do?",
                  "Tell me about your widgets",
                  "I have an issue with my widget",
                  "I want to leave a review",
                ].map((text, i) => (
                  <Button
                    key={i}
                    variant="contained"
                    onClick={() => {
                      setInput(text);
                      handleSubmit();
                    }}
                    sx={{
                      alignSelf: "flex-start",
                      backgroundColor: "#3a3f4a",
                      color: "white",
                      textTransform: "none",
                      borderRadius: 999,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#c2185b",
                      },
                    }}
                  >
                    {text}
                  </Button>
                ))}
              </Box>
            )}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 1,
              backgroundColor: "white",
            }}
          >
            <TextField
              fullWidth
              placeholder="Write your message..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#3a3f4a",
                "&:hover": { backgroundColor: "#c2185b" },
              }}
            >
              ➤
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
