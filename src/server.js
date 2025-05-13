import { app } from "./app.js";
import connectDB from "./db/Db_connection.js";
import dotenv from "dotenv";


dotenv.config()
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection faliure !!!!", err);
  });
