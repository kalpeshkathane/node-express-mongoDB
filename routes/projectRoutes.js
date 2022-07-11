let express = require("express");
const projectController = require("../controllers/projectController");

let router = express.Router();

router.get("/", projectController.getProjects);

router.get("/:id", projectController.getProjectsById);

router.post("/add", projectController.addProjects);

router.put("/update/:id", projectController.updateProjects);

router.delete("/delete/:id", projectController.deleteProjects);

module.exports = router;
