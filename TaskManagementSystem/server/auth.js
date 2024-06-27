const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const admin = require('./firebase/firebaseAdmin');
require('dotenv').config();


const client = jwksClient({
  jwksUri: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/keys`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyOktaToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

async function createFirebaseCustomToken(uid, additionalClaims) {
  return admin.auth().createCustomToken(uid, additionalClaims);
}

async function updateFirebaseUser(uid, additionalClaims) {
  return admin.auth().updateUser(uid, additionalClaims);
}

module.exports = {
  verifyOktaToken,
  createFirebaseCustomToken,
  updateFirebaseUser
};