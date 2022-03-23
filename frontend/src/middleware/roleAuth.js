const { verifyToken } = require("../utils/generateToken");
const userModel = require("../models/users");

const checkRoleAuth = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ").pop();
    const tokenData = await verifyToken(token);
    const userData = await userModel.findById(tokenData._id);

    if ([].concat(roles).includes(userData.role)) {
      next();
    } else {
      res.status(409).send({ error: "No permissions" });
    }
  } catch (e) {}
};

module.exports = checkRoleAuth;
