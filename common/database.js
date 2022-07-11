const { MongoClient } = require("mongodb");
const DB_URL = require("../properties").DB_URL;

const client = new MongoClient(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function () {
    client.connect(function (err, db) {
      if (err || !db) {
        console.log("Error while db connection");
      }

      dbConnection = db.db("ProjectManagement");
      console.log("Successfully connected to MongoDB.");
    });
  },

  getDb: function () {
    return dbConnection;
  },
};
