import { useState, useRef, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const aiMessage = {
      sender: "ai",
      text: "This is a simulated reply. Thanks for your message!",
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);

    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Toggle Button */}
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
              backgroundColor: "#1e88e5",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            <ChatIcon />
          </IconButton>
        )}
      </Box>

      {/* Chat Popup */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 320,
            height: 480,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#121212",
            color: "white",
            borderRadius: 2,
            boxShadow: 6,
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
              backgroundColor: "#1e1e1e",
              borderBottom: "1px solid #333",
            }}
          >
            <Typography variant="subtitle1">Chat Assistant</Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            ref={chatRef}
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {messages.map((msg, idx) => (
              <Paper
                key={idx}
                sx={{
                  p: 1.5,
                  maxWidth: "80%",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#1e88e5" : "#333",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography fontSize="0.9rem">{msg.text}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 1.5,
              borderTop: "1px solid #333",
              display: "flex",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Type a message..."
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Send
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
