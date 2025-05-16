import { Router } from "express";
import {
  registerUser,
  LoginUser,
  LogoutUser,
} from "../controllers/user.controllers.js";

import { userAuthVerification } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(LoginUser);
router.route("/logout").post(userAuthVerification, LogoutUser);

export default router;
