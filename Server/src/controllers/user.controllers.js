import { ApiError } from "../utils/ApiError.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim())
    {
        throw new ApiError(400, "All fields are required");
    }

    const existUser = await User.findOne({ $or: [{ email }, { username }], });

    if (existUser)
    {
        throw new ApiError(409, "User already exists");
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.create({

        username,
        email,
        password: hashpassword,
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
      );
    
      if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering");
      }
    
      return res
        .status(201)
        .json(new ApiResponses(201, createdUser, "User registered successfully"));
    
});

// LOGIN USER
const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const userPasswordValid = await bcrypt.compare(password,user.password);
  if (!userPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(
      new ApiResponses(
        200,
        {
          user,
        },
        "User logged In Successfully"
      )
    );
});

// LOGOUT USER
const LogoutUser = asyncHandler(async (req, res) => {

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponses(200, {}, "User logged Out Successfully"));
});


export {
  registerUser,
  LoginUser,
  LogoutUser,
};