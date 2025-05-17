import { Router } from "express";
import {
  addTask,
  updateTask,
  deleteTask,
  getAllTask,
} from "../controllers/task.controllers.js";

import { userAuthVerification } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/add").post(userAuthVerification, addTask);
router.route("/update/:taskId").put(userAuthVerification, updateTask);
router.route("/delete/:taskId").delete(userAuthVerification, deleteTask);
router.route("/all").get(userAuthVerification, getAllTask);

export default router;
