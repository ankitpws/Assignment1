const {
  addemployee,
  updateemployee,
  getOneEmployee,
  getAllEmployee,
  addReportingManager,
  getReportingManager,
  getsubordinate,
} = require("../controllers/employee.controller.js");
const verifyToken = require("../middleware/authJWT.js");

var express = require("express"),
  router = express.Router();
router.post("/", verifyToken, addemployee);
router.put("/:id", verifyToken, updateemployee);
router.get("/:id", verifyToken, getOneEmployee);
router.get("/fetchall/:id", verifyToken, getAllEmployee);
router.put("/addreportingmanager/:id", verifyToken, addReportingManager);
router.get("/getreportingmanager/:id", verifyToken, getReportingManager);
router.get("/getsubordinate/:id", verifyToken, getsubordinate);
module.exports = router;
