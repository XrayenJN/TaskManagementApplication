const express = require("express");
const bodyParser = require('body-parser');
const { verifyOktaToken, createFirebaseCustomToken } = require('./auth')
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8888;

const app = express();

// Set COOP header for all responses
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Very basic format
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(bodyParser.json());
app.use(cors());
app.post('/api/auth/okta', async (req, res) => {
  const oktaToken = req.body.token;
  console.log(oktaToken)
　if (!oktaToken) {
    return res.status(400).json({ error: 'Token is required' });
  }

  // Here, you would typically verify the token and create a Firebase custom token
  // For simplicity, we'll just return a mock custom token
  // const mockFirebaseToken = 'mock-firebase-token';

  // res.json({ firebaseToken: mockFirebaseToken });
  try {
    // const decoded = await verifyOktaToken(oktaToken);
    // const uid = decoded.sub
    const uid = oktaToken.claims.uid;
    const email = oktaToken.claims.sub;
    const customClaims = { email: email };
    const firebaseToken = await createFirebaseCustomToken(uid, customClaims);

    res.json({ firebaseToken })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})