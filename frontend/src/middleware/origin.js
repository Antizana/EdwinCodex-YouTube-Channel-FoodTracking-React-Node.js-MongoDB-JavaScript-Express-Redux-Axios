const checkOrigin = (req, res, next) => {
  const token = req.headers.authorization.split(" ").pop();
  if (token === "123456") {
    next();
  } else {
    res.status(409).send({ error: "Invalid access" });
  }
  console.log(req.headers);
};

export default checkOrigin;
