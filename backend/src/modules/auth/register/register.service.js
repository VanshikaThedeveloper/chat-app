import bcrypt from "bcryptjs";
import User from "../../../models/user.model.js";

export const registerUserService = async ({ username, email, password }) => {
  //  chcek existing email
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return user;
};
