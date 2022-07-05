const jwt = require("jsonwebtoken");


const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-API-KEY"];
    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });
    try {
      const decoded = jwt.verify(token, "projectone");
      req["decodedauthor"] = decoded.authorId.toString()
    } catch (err) {
      return res.status(401).send({status: false, msg:"Invalid Token"});
    }
    next();
  } catch (error) {
    res.status(500).send({ err: error });
  }
};


module.exports.authenticate = authenticate;
