const jwt = require("jsonwebtoken");
User = require("../models/employee.model");

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.API_SECRET,
      function (err, decode) {
        if (err) {
          res.status(500).send({
            message: err,
          });
        }
        User.findOne({
          _id: decode.id,
        }).exec((err, user) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
          } else {
            if (req.type == "GET") {
              req.user = user;
              next();
            } else {
              if (user.role == "admin") {
                req.user = user;
                next();
              } else {
                res.status(500).send({
                  message: "Access Denied",
                });
              }
            }
          }
        });
      }
    );
  } else {
    req.user = undefined;
    next();
  }
};
module.exports = verifyToken;
