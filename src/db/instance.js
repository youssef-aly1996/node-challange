import { connect, set } from "mongoose";

//db env variables
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;

export const dbConn = () => {
  //intializing db connection
  const MONGO_URI = `mongodb://${host}:${port}/${db}`;
  set("strictQuery", false);
  connect(MONGO_URI, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log("db are ", host, port, db);
    })
    .catch((error) => {
      console.log(error);
    });
};
