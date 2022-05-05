const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
mongoose = require("mongoose");
const userRoutes = require("./app/routes/auth.routes");
const employeeRoutes = require("./app/routes/employee.routes");
const companyRoutes = require("./app/routes/company.routes");
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/config/db.config");
try {
  mongoose.connect(db.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log("connected to db");
} catch (error) {
  console.log(error);
  handleError(error);
}
process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection", error.message);
});
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});
app.use("/auth", userRoutes);
app.use("/employee", employeeRoutes);
app.use("/company", companyRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
