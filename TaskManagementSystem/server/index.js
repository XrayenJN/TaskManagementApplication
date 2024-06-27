const express = require("express");

const PORT = process.env.PORT || 8888;

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// Set COOP header for all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

