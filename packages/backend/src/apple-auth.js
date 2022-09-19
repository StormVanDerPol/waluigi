const { request } = require('undici');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

let certsMemo = null;

// eslint-disable-next-line camelcase
async function verifyAppleJWT(authorization, nonce) {
  const id_token = authorization.id_token;

  let webtoken = null;

  if (!certsMemo) {
    const res = await request('https://appleid.apple.com/auth/keys', { method: 'GET' });
    const body = await res.body.json();

    JWKSet = body.keys;
    const certs = JWKSet.map((jwk) => jwkToPem(jwk));
    certsMemo = certs;
  }

  for (const cert of certsMemo) {
    try {
      webtoken = jwt.verify(id_token, cert, { algorithms: ['RS256'], issuer: 'https://appleid.apple.com', audience: 'test.com.resumedia.apple-auth', nonce });
    } catch (error) {
      //  Failed to verify with current JWK.
      console.error('[APPLE AUTH DEBUG] Failed to verify token with a JWK', error);
    }
  }

  if (!webtoken) {
    const err = new Error('failed to verify Apple JWT');
    err.status = 400;
    throw err;
  }

  console.log('[APPLE AUTH DEBUG] 🐱🐱🐱 Authentication success!!!! 🐱🐱🐱');
  return webtoken;
}

const appleAuth = (req) => {
  const { authorization, nonce } = req.body;
  const webtoken = verifyAppleJWT(authorization, nonce);
  return webtoken;
};

module.exports = appleAuth;
