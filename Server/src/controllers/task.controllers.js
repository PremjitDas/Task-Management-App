import { ApiError } from "../utils/ApiError.js";
import { ApiResponses } from "../utils/ApiResponses.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/task.models.js";



const addTask = asyncHandler(async (req, res) => {
    
    const { title, description } = req.body;

    if (!title)
    {
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

    const { title, description , id } = req.body;

    if (!title || !description)
    {
        throw new ApiError(400, "All field are required");
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title,
          description: description,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    
    return res
      .status(200)
      .json(new ApiResponses(200, task, " Task Update Successfully"));
});


const deleteTask = asyncHandler(async (req, res) => {
    
  const { id } = req.body;

  const deletetask = await Task.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponses(200, deletetask, " Task Delete Successfully"));

});

const getAllTask = asyncHandler(async (req, res) => {
  try {
    const userId = "68246fa41c5b598ca20be3bb";
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    // console.log(tasks);
    return res
      .status(200)
      .json(new ApiResponses(200, tasks, " Tasks retrieved successfully"));
  } catch (error) {
    
    return res
      .status(500)
      .json(new ApiError(500, " Failed to retrieve tasks"));
  }
});

export { addTask, updateTask, deleteTask, getAllTask };