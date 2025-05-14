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



export { addTask, updateTask, deleteTask };