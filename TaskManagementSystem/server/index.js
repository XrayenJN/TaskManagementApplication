const express = require("express");
const bodyParser = require('body-parser');
const { createFirebaseCustomToken, updateFirebaseUser } = require('./auth')
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

/**
 * Dealing with getting the firebase token from Okta token
 */
app.use(bodyParser.json());
app.use(cors());
app.post('/api/auth/okta', async (req, res) => {
  const oktaToken = req.body.token;
  console.log(oktaToken)
  if (!oktaToken) {
    return res.status(400).json({ error: 'Token is required' });
  }
  try {
    const uid = oktaToken.claims.uid;
    const userEmail = oktaToken.claims.sub;

    // TODO: this customClaims doesnt work, 
    // even though it's the same with the documentation
    const customClaims = { email: userEmail };
    const firebaseToken = await createFirebaseCustomToken(uid, customClaims);

    res.json({ firebaseToken })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

/**
 * Dealing with updating email identification on the firebase db
 */
app.post('/api/firebase/updateUser', async (req, res) => {
  try {
    const uid = req.body.uid;
    const additionalInformations = req.body.informations;

    const result = await updateFirebaseUser(uid, additionalInformations);

    res.json({ result: result })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

})