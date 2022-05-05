var bcrypt = require("bcrypt");
var Employee = require("../models/employee.model");
var Company = require("../models/company.model");

function updateEmployeeCounter(data) {
  const id = data.id;
  const body = {
    empAlise:
      data.empAlise.split("-")[0] +
      "-" +
      (parseInt(data.empAlise.split("-")[1]) + 1),
  };
  console.log(body);
  Company.findByIdAndUpdate(id, body, { useFindAndModify: false }).then(
    (data) => {
      return true;
    }
  );
}

exports.addemployee = (req, res) => {
  Company.find({ companyCode: req.body.companyCode }).then((data) => {
    if (!data[0]) {
      res.status(500).send({
        message: "Company not found",
      });
    }
    const employee = new Employee({
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
      reportingManger: req.body.reportingManger,
      companyCode: req.body.companyCode,
      employeeCode: data[0].empAlise,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    employee.save(async (err, employee) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      } else {
        await updateEmployeeCounter(data[0]);
        res.status(200).send({
          message: "employee Registered successfully",
        });
      }
    });
  });
};

exports.updateemployee = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  if (req.body.employeeCode) {
    res.status(500).send({
      message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
    });
  }

  Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else res.send({ message: "Employee was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Employee with id=" + id,
      });
    });
};

exports.getOneEmployee = (req, res) => {
  const id = req.params.id;
  Employee.find({ employeeCode: id })
    .select([
      "_id",
      "fullName",
      "email",
      "companyCode",
      "employeeCode",
      "reportingManager",
      "subOrdinate",
    ])
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else
        res.send({
          data: data,
          message: "Record Fetched.",
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error in finding Employee with id=" + id,
      });
    });
};

exports.getAllEmployee = (req, res) => {
  const id = req.params.id;
  Employee.find({ companyCode: id })
    .select([
      "_id",
      "fullName",
      "email",
      "companyCode",
      "employeeCode",
      "reportingManager",
      "subOrdinate",
    ])
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Employee with Company id=${id}. Maybe Compnay was not found!`,
        });
      } else {
        res.status(200).send({
          data: data,
          message: "Record Fetched.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error finding Employee with id=" + id,
      });
    });
};

module.exports.addReportingManager = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;
  if (req.body.employeeCode) {
    res.status(500).send({
      message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
    });
  }

  Employee.find({ employeeCode: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else {
        Employee.find({ employeeCode: req.body.reportingManager }).then(
          (manager) => {
            if (!manager) {
              res.status(404).send({
                message: `Cannot update Employee with id=${id}. Maybe Employee was not found!`,
              });
            } else {
              let addReportingManger = [
                ...data[0].reportingManager,
                req.body.reportingManager,
              ];
              Employee.findByIdAndUpdate(
                data[0].id,
                { reportingManager: addReportingManger },
                { useFindAndModify: false }
              ).then((reportingMangerAdded) => {
                let subOrdinate = [...manager[0].subOrdinate, id];
                Employee.findByIdAndUpdate(
                  manager[0].id,
                  { subOrdinate: subOrdinate },
                  { useFindAndModify: false }
                ).then((subOrdinateAdded) => {
                  res.status(200).send({
                    message: "Reproting manager added.",
                  });
                });
              });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Employee with id=" + id,
      });
    });
};

exports.getReportingManager = (req, res) => {
  const id = req.params.id;
  Employee.find({ employeeCode: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else {
        Employee.find({ employeeCode: { $in: data[0].reportingManager } })
          .select(["_id", "fullName", "email", "companyCode", "employeeCode"])
          .then((reportingManager) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot find Employee with id=${id}. Maybe Employee was not found!`,
              });
            } else {
              res.status(200).send({
                data: reportingManager,
                message: `record Fetched`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message: "Error in finding Employee with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error in finding Employee with id=" + id,
      });
    });
};

exports.getsubordinate = (req, res) => {
  const id = req.params.id;
  Employee.find({ employeeCode: id })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot find Employee with id=${id}. Maybe Employee was not found!`,
        });
      } else {
        Employee.find({ employeeCode: { $in: data[0].subOrdinate } })
          .select(["_id", "fullName", "email", "companyCode", "employeeCode"])
          .then((subOrdinate) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot find Employee with id=${id}. Maybe Employee was not found!`,
              });
            } else {
              res.status(200).send({
                data: subOrdinate,
                message: `record Fetched`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send({
              message: "Error in finding Employee with id=" + id,
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error in finding Employee with id=" + id,
      });
    });
};
