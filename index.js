const express = require("express");
const projects = require("./routes/projectRoutes.js");
const dbConnection = require("./common/database");

let server = express();
//Body Parser
server.use(express.json({}));

//DB Connection
dbConnection.connectToServer();

//Routing
server.get("/", (req, res) => {
  res.send("Project Management API");
});
server.use("/projects", projects);

server.get("*", (req, res) => {
  res.send("Page Not Found");
});

//Server listing PORT 8080
server.listen(8080, function () {
  console.log("Server Started 8080");
});
