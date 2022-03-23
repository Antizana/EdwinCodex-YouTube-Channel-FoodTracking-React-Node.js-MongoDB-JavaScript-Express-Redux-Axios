const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

exports.checkAuthorization = (audience) => {
  const ADMIN = process.env.REACT_APP_ADMIN || "admin";
  if (audience !== ADMIN) auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  else if (audience === ADMIN)
    auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE_ADMIN;
  else auth0Audience = audience;

  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  });
};
