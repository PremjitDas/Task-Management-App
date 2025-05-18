import React, { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userAtom } from "../store/useAtom.js";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Edit2,
  Trash2,
  LogOut,
  Plus,
  X,
  CheckSquare,
  Square,
  Search,
} from "lucide-react";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskInput, setTaskInput] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/v1/tasks/all", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.error("Authentication error. Redirecting to login.");
          resetUser();
          navigate("/login");
          return;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data = await res.json();
      setTasks(data.data || []);
      setFilteredTasks(data.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError(
        "Failed to load tasks. Please check your connection and login status."
      );
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchTasks();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredTasks(filtered);
    }
  }, [searchTerm, tasks]);

  const handleInputChange = (e) => {
    setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const addOrUpdateTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!taskInput.title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);

    try {
      const url = editingTaskId
        ? `http://localhost:8080/api/v1/tasks/update/${editingTaskId}`
        : "http://localhost:8080/api/v1/tasks/add";
      const method = editingTaskId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify(taskInput),
      });

      if (!res.ok) {
        if (res.status === 401) {
          resetUser();
          navigate("/login");
          return;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }

      setTaskInput({ title: "", description: "", completed: false });
      setEditingTaskId(null);
      await fetchTasks();
    } catch (error) {
      console.error("Error adding/updating task:", error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/tasks/delete/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              : {}),
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          resetUser();
          navigate("/login");
          return;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (task) => {
    setLoading(true);
    setError("");

    try {
      const updatedTask = { ...task, completed: !task.completed };

      const res = await fetch(
        `http://localhost:8080/api/v1/tasks/update/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("token")
              ? {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
              : {}),
          },
          credentials: "include",
          body: JSON.stringify(updatedTask),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          resetUser();
          navigate("/login");
          return;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error updating task completion:", error);
      setError("Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8080/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      resetUser();
      localStorage.removeItem("token");
      navigate("/login");
      setLoading(false);
    }
  };

  if (!user || !user._id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Not authenticated. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-blue-500" size={28} />
            <h1 className="text-3xl font-bold">Task</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              disabled={loading}
              className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span>{loading ? "Processing..." : "Logout"}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-100 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Task Input Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingTaskId ? "Edit Task" : "Add New Task"}
          </h2>
          <form onSubmit={addOrUpdateTask} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Task Title
              </label>
              <input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={taskInput.title}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Task Description
              </label>
              <input
                id="description"
                name="description"
                placeholder="Enter task description"
                value={taskInput.description}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors flex-1"
              >
                {editingTaskId ? (
                  <>
                    <Edit2 size={16} />
                    <span>{loading ? "Updating..." : "Update Task"}</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>{loading ? "Adding..." : "Add Task"}</span>
                  </>
                )}
              </button>
              {editingTaskId && (
                <button
                  type="button"
                  onClick={() => {
                    setTaskInput({
                      title: "",
                      description: "",
                      completed: false,
                    });
                    setEditingTaskId(null);
                  }}
                  disabled={loading}
                  className="flex items-center justify-center space-x-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-semibold mb-1">Your Tasks</h2>
            <p className="text-gray-400 text-sm mb-4">
              Manage and track your tasks
            </p>

            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {loading && !filteredTasks.length && !tasks.length && (
            <div className="flex justify-center items-center p-8 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <span>Loading tasks...</span>
            </div>
          )}

          {filteredTasks.length === 0 && !loading ? (
            <div className="text-center p-12 text-gray-400">
              {searchTerm && tasks.length > 0 ? (
                <>
                  <Search className="mx-auto mb-4 text-gray-600" size={48} />
                  <p className="mb-2">No tasks match your search</p>
                  <p className="text-sm">Try a different search term</p>
                </>
              ) : (
                <>
                  <CheckCircle
                    className="mx-auto mb-4 text-gray-600"
                    size={48}
                  />
                  <p className="mb-2">No tasks found</p>
                  <p className="text-sm">Add a new task to get started</p>
                </>
              )}
            </div>
          ) : (
            <div className="px-6 pb-6">
              <div className="divide-y divide-gray-700">
                {filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="py-4 flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTaskCompletion(task)}
                        className="mt-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        {task.completed ? (
                          <CheckSquare size={20} className="text-blue-500" />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h3>
                        {task.description && (
                          <p
                            className={`text-sm mt-1 ${
                              task.completed ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setTaskInput({
                            title: task.title,
                            description: task.description,
                            completed: task.completed,
                          });
                          setEditingTaskId(task._id);
                        }}
                        disabled={loading}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-900/30 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        disabled={loading}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-900/30 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}