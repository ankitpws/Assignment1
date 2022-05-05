const {
  addcompany,
  updateCompany,
  getOneCompany,
  getAllCompany,
} = require("../controllers/company.controller.js");
const verifyToken = require("../middleware/authJWT.js");

var express = require("express"),
  router = express.Router();
router.post("/", verifyToken, addcompany);
router.put("/:id", verifyToken, updateCompany);
router.get("/fetchall", verifyToken, getAllCompany);
router.get("/:id", verifyToken, getOneCompany);

module.exports = router;
