import mongoose from "mongoose";

//   connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Mongodb connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
