const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async function (request, response) {
  try {
    const { email, password, username } = request.value;

    const user = await User.findOne({ email });

    if (user) {
      return response.status(409).json({ message: "Email already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    return response.status(201).json({
      message: "User created successfully.",
      userId: newUser._id,
    });
  } catch (error) {
    console.log(error);

    return response.status(500).json({ message: "Internal Server Error" });
  }
};
exports.login = async function (request, response) {
  try {
    const { email, password } = request.value;
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return response.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getMe = async function (req, res) {
  try {
    //get id
    const userId = req.user._id;
    //get user by id
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //send respnose
    return res.status(200).json({ user });
  } catch (error) {
    console.log(`debug error >> inauth/get me:${error}`);
    res.status(500).json({ message: "internal server error" });
  }
};
