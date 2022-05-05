var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var Employee = require("../models/employee.model");
require("dotenv").config();

exports.signup = (req, res) => {
  const employee = new Employee({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  employee.save((err, employee) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    } else {
      res.status(200).send({
        message: "employee Registered successfully",
      });
    }
  });
};

exports.signin = (req, res) => {
  Employee.findOne({
    email: req.body.email,
  }).exec((err, employee) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
      return;
    }
    if (!employee) {
      return res.status(404).send({
        message: "employee Not found.",
      });
    }

    //comparing passwords
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      employee.password
    );
    // checking if password was valid and send response accordingly
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }
    //signing token with employee id
    var token = jwt.sign(
      {
        id: employee.id,
        role: employee.role,
      },
      process.env.API_SECRET,
      {
        expiresIn: 86400,
      }
    );

    //responding to client request with employee profile success message and  access token .
    res.status(200).send({
      employee: {
        id: employee._id,
        email: employee.email,
        fullName: employee.fullName,
      },
      message: "Login successfull",
      accessToken: token,
    });
  });
};
