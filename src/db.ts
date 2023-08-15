import { MongoClient, Db } from "mongodb";

const URL = "mongodb://localhost:27017/movies_db";

let dbConnection: Db;

const conntectToDb = (cb: (value?: string) => void) => {
  MongoClient.connect(URL)
    .then((client) => {
      console.log("Connect to MongoDB ");
      dbConnection = client.db();
      return cb();
    })
    .catch((error) => cb(error));
};

const getDb = () => dbConnection;

export { conntectToDb, getDb };
