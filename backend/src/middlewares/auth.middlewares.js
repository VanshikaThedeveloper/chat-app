import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {

    // it holds the bearer token for Authorization
    const authHeader = req.headers.authorization;


    // two checks :- 1) aut header is not there 2) auth hearder  does not start with bearer => if any one of them occur so we gave an error 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }


    // if token is there with the request so extract the token from the header and verify it 
    // ! [1] kyu => so "Bearer Token" ye spaces ke  basis par split hoga jo ki hoga ["Bearer" ,"Token"] so token is on firsr position so access it.
    const token = authHeader.split(" ")[1];


    // now here, we chcek the signature  so is te token is genuine or fake and expirration of token  and then return the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);



    // find the user from the database after removing password
    const user = await User.findById(decoded.userId).select("-password");


    // if user is not fetched so thorw an error
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // if user is fetched successfully then stored in the req 
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
