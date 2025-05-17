import { ApiError } from "../utils/ApiError.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.models.js";

const addTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const usertask = await Task.create({
    title,
    description: description || "",
    user: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponses(200, usertask, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { taskId } = req.params;

  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: req.user._id },
    { $set: { title, description } },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponses(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findOneAndDelete({
    _id: taskId,
    user: req.user._id,
  });

  if (!deletedTask) {
    throw new ApiError(404, "Task not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponses(200, deletedTask, "Task deleted successfully"));
});

const getAllTask = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponses(200, tasks, "Tasks retrieved successfully"));
});

export { addTask, updateTask, deleteTask, getAllTask };
