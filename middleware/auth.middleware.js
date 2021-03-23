import jwt from "jsonwebtoken";
import {JWT_SECRET} from '../config/config.js'

const auth = async (req, res, next) => {
  try {

    if(!req.headers.authorization) {
      res.status(401).json({message: "No token provided"})
    }
    
    const token = req.headers.authorization?.split(" ")[1]
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, JWT_SECRET);

      req.userId = decodedData?.id;
      req.username = decodedData?.username
      
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;