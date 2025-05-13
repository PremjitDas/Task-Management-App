import mongoose from "mongoose";

//const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

const connectDB = async () => {
  try {
    const connectionResp = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(
      `\n MongoDB connected !! DB Host: ${connectionResp.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR", error);
    process.exit(1);
  }
};

export default connectDB;
