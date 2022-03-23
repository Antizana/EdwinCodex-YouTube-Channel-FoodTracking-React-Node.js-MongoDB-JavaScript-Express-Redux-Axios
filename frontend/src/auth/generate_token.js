const { KJUR, b64utoutf8 } = require("jsrsasign");

const tokenSign = async (user) => {
  var sHeader = JSON.stringify({ alg: "HS256", typ: "JWT" });
  return KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    user,
    process.env.REACT_APP_JWT_SECRET
  );
};

const verifyToken = async (token) => {
  try {
    const isValid = KJUR.jws.JWS.verifyJWT(
      token,
      process.env.REACT_APP_JWT_SECRET,
      { alg: ["HS256"] }
    );
    return isValid;
  } catch (e) {
    return null;
  }
};

const decodeSign = (token) => {
  if (!token) return "";
  return KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[1]));
};

const decodeHeader = (token) => {
  if (!token) return "";
  return KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split(".")[0]));
};

module.exports = { tokenSign, decodeSign, decodeHeader, verifyToken };
