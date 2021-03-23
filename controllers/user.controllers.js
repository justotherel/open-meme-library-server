import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const JWT_SECRET = "I love Taylor Swift";

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({username})
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password, existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        username: existingUser.username,
        email: existingUser.email,
        id: existingUser._id,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const id = existingUser._id
    const profilePic = existingUser.profilePic

    res.status(200).json({username, id, profilePic, token});

  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Internal server error. Something went worng" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    const usernameExists = await User.findOne({ email });
    const emailExists = await User.findOne({ username });

    if (emailExists)
      return res
        .status(400)
        .json({ message: "User with this email already exists" });

    if (usernameExists)
      return res
        .status(400)
        .json({ message: "User with this username already exists" });

    if (password != confirmPassword) 
        return res.status(400).json({ message: "Passwords don't not match" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      email,
      username,
      password: hashedPassword,
      profilePic: ""
    });
    const token = jwt.sign(
      { username: result.username, email: result.email, id: result._id, profilePic: result.profilePic },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: result, token });

  } catch (error) {
    
    res
      .status(500)
      .json({ message: "Internal server error. Something went worng" });
  }
};
