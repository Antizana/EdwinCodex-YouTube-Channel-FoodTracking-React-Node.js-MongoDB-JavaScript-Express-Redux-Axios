const httpError = (res, err) => {
  console.log(err);
  res.status(500).send({ error: "Internal server error" });
};

export default httpError;
