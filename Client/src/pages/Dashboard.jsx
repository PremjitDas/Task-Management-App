import React, { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userAtom } from "../store/useAtom.js";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskInput, setTaskInput] = useState({ title: "", description: "" });
  const [searchTerm, setSearchTerm] = useState("");
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
      const fetchedTasks = data.data || [];
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
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

  // Filter tasks when searchTerm or tasks change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
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

  const clearSearch = () => {
    setSearchTerm("");
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

      setTaskInput({ title: "", description: "" });
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
    return <div>Not authenticated. Redirecting to login...</div>;
  }

  return (
    <div>
      <div>
        <h2>Welcome, {user?.username}</h2>
        <button onClick={logout} disabled={loading}>
          {loading ? "Processing..." : "Logout"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={addOrUpdateTask}>
        <div>
          <input
            name="title"
            placeholder="Task Title"
            value={taskInput.title}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <div>
          <input
            name="description"
            placeholder="Task Description"
            value={taskInput.description}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : editingTaskId ? "Update" : "Add"} Task
        </button>
        {editingTaskId && (
          <button
            type="button"
            onClick={() => {
              setTaskInput({ title: "", description: "" });
              setEditingTaskId(null);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={loading}
        />
        {searchTerm && (
          <button onClick={clearSearch} disabled={loading}>
            Clear
          </button>
        )}
      </div>

      {loading && <div>Loading tasks...</div>}

      {tasks.length === 0 && !loading ? (
        <div>No tasks found. Add a new task to get started.</div>
      ) : filteredTasks.length === 0 && !loading ? (
        <div>No tasks match your search. Try a different keyword.</div>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
              <div>
                <button
                  onClick={() => {
                    setTaskInput({
                      title: task.title,
                      description: task.description,
                    });
                    setEditingTaskId(task._id);
                  }}
                  disabled={loading}
                >
                  Edit
                </button>
                <button onClick={() => deleteTask(task._id)} disabled={loading}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
