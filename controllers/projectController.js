const dbo = require("../common/database");
const commonUtility = require("../common/commonUtility");
var ObjectId = require("mongodb").ObjectId;

class ProjectController {
  async getProjects(req, res) {
    try {
      const dbConnect = dbo.getDb();
      const sortDir = req.query.sortDir || "desc";
      const sortCol = req.query.sortCol || "createdAt";
      const limitValue = req.query.pageSize || "3";
      const skipValue = (req.query.pageNo - 1) * limitValue || "0";
      let search = { isDeleted: false };
      if (req.query.search) {
        search = {
          ...search,
          title: { $regex: req.query.search, $options: "i" },
        };
      }
      let totalCount = 0;
      dbConnect
        .collection("projects")
        .count(search)
        .then((result) => {
          totalCount = result;
        });
      dbConnect
        .collection("projects")
        .find(search)
        .project({ isDeleted: 0 })
        .sort({ [sortCol]: sortDir })
        .limit(parseInt(limitValue))
        .skip(parseInt(skipValue))
        .toArray(function (err, result) {
          if (err) {
            res.status(500).send("Error fetching listings!");
          } else {
            let response = {
              data: result,
              pageSize: limitValue,
              pageNo: req.query.pageNo || "1",
              totalCount: totalCount,
            };
            res.json(response);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getProjectsById(req, res) {
    try {
      const dbConnect = dbo.getDb();
      dbConnect
        .collection("projects")
        .find(ObjectId(req.params.id))
        .project({ isDeleted: 0 })
        .toArray(function (err, result) {
          if (err) {
            res.status(500).send("Error fetching listings!");
          } else {
            res.json(result[0]);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async addProjects(req, res) {
    try {
      const dbConnect = dbo.getDb();
      let reqBody = req.body;
      let timeStamp = commonUtility.getCreatedTimeStamp("121212");
      reqBody = { ...reqBody, ...timeStamp };
      dbConnect
        .collection("projects")
        .insertOne(reqBody, function (err, result) {
          if (err) {
            res.status(400).send("Error inserting matches!");
          } else {
            console.log(`Added a new match with id ${result.insertedId}`);
            res.status(201).send({ _id: result.insertedId, ...reqBody });
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async updateProjects(req, res) {
    try {
      const dbConnect = dbo.getDb();
      let reqData = req.body;
      let updateReq = commonUtility.getUpdatedTimeStamp("121212");
      const listingQuery = { _id: ObjectId(req.params.id) };
      const updates = {
        $set: {
          ...reqData,
          ...updateReq,
        },
      };

      dbConnect
        .collection("projects")
        .updateOne(listingQuery, updates, function (err, result) {
          if (err) {
            res.status(400).send(`Error while updating id ${listingQuery.id}!`);
          } else {
            res
              .status(200)
              .json({ _id: req.params.id, ...reqData, ...updateReq });
            console.log("1 document updated", req.params.id);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteProjects(req, res) {
    try {
      const dbConnect = dbo.getDb();
      let deleteReq = commonUtility.getUpdatedTimeStamp("121212");
      deleteReq = { ...deleteReq, isDeleted: true };
      const listingQuery = { _id: ObjectId(req.params.id) };
      const updates = {
        $set: deleteReq,
      };

      dbConnect
        .collection("projects")
        .updateOne(listingQuery, updates, function (err, result) {
          if (err) {
            console.log(err);
            res
              .status(400)
              .send(
                `Error updating likes on listing with id ${listingQuery.id}!`
              );
          } else {
            res.status(204).json(result);
            console.log("1 document updated");
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = new ProjectController();
