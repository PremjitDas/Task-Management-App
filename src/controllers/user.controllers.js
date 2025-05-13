import { ApiError } from "../utils/ApiError.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

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

const LoginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const userPasswordValid = await user.isPasswordCorrect(password);
  if (!userPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id.toString());

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponses(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const LogoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  ).select(
    "-password"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponses(200, user, "User logged Out Successfully"));
});


export {
  registerUser,
  LoginUser,
  LogoutUser,
};