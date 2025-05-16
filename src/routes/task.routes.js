import { Router } from "express";
import {
  addTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controllers.js";

import { userAuthVerification } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/addtask").post(userAuthVerification, addTask);
router.route("/updatetask").post(userAuthVerification, updateTask);
router.route("/deletetask").post(userAuthVerification, deleteTask);

export default router;
