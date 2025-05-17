import { Router } from "express";
import {
  addTask,
  updateTask,
  deleteTask,
  getAllTask,
} from "../controllers/task.controllers.js";

import { userAuthVerification } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/addtask").post(userAuthVerification, addTask);
router.route("/updatetask").put(userAuthVerification, updateTask);
router.route("/deletetask").delete(userAuthVerification, deleteTask);
router.route("/gettask").get(getAllTask);

export default router;
