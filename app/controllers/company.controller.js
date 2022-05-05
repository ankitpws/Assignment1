var Company = require("../models/company.model");
require("dotenv").config();

exports.addcompany = (req, res) => {
  let companyCode;
  Company.find({})
    .sort({ _id: -1 })
    .limit(1)
    .then((data) => {
      console.log(data);
      if (data[0]) {
        companyCode =
          "COM_" + (parseInt(data[0].companyCode.split("_")[1]) + 1);
        console.log(companyCode);
      } else companyCode = "COM_" + 1;
      console.log(companyCode);
      const company = new Company({
        companyName: req.body.companyName,
        email: req.body.email,
        companyCode: companyCode,
        empAlise: companyCode + "-" + 1,
      });

      company.save((err, company) => {
        if (err) {
          res.status(500).send({
            message: err,
          });
          return;
        } else {
          res.status(200).send({
            message: "Company Registered successfully",
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Company with id=" + id,
      });
    });
};

exports.updateCompany = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  if (req.body.companyCode || req.body.empAlise) {
    res.status(500).send({
      message: `Cannot update Company with id=${id}. Maybe Company was not found!`,
    });
  }

  Company.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Company with id=${id}. Maybe Company was not found!`,
        });
      } else res.send({ message: "Company was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Compnany with id=" + id,
      });
    });
};

exports.getOneCompany = (req, res) => {
  const id = req.params.id;
  Company.find({ companyCode: id })
    .select(["_id", "companyName", "email", "companyCode", "created"])
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Company with id=${id}. Maybe Company was not found!`,
        });
      } else
        res.send({
          data: data,
          message: "Record Fetched.",
        });
    })
    .catch((err) => {
      console.log(err);
      console.log(err);
      res.status(500).send({
        message: "Error finding Company with id=" + id,
      });
    });
};

exports.getAllCompany = (req, res) => {
  Company.find({})
    .select(["_id", "companyName", "email", "companyCode", "created"])
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find company.`,
        });
      } else {
        res.send({
          data: data,
          message: "Record Fetched.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error finding compnay.",
      });
    });
};
