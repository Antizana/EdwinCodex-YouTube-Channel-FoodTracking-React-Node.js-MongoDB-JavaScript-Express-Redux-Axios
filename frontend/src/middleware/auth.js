const { verifyToken } = require("../utils/generateToken");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);
    console.log(tokenData);
    if (tokenData._id) {
      next();
    } else {
      res.status(409).send({ error: "Invalid access" });
    }
  } catch (e) {
    console.log(e);
    res.status(409).send({ error: "Invalid access" });
  }
};

module.exports = checkAuth;
