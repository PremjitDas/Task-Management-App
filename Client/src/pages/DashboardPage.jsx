import React, { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userAtom } from "../store/useAtom.js";
import { useNavigate } from "react-router-dom";

// Import all dashboard components
import DashboardHeader from "../components/DashboardHeader.jsx";
import DashboardStats from "../components/DashboardStats.jsx";
import FilterSortBar from "../components/FilterSortBar.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskModal from "../components/TaskModal.jsx";
import AddTaskButton from "../components/AddTaskButton.jsx";

export default function DashboardPage() {
  const user = useRecoilValue(userAtom);
  const resetUser = useResetRecoilState(userAtom);
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
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

  // Filter and sort the tasks
  const filteredAndSortedTasks = [...filteredTasks]
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.status === "completed";
      if (filter === "pending") return task.status === "pending";
      if (filter === "overdue")
        return (
          task.status === "pending" &&
          task.dueDate &&
          new Date(task.dueDate) < new Date()
        );
      return task.category === filter;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (
          (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
        );
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Get unique categories from tasks
  const categories = ["Work", "Personal", "Study", "Health", "Other"];

  // Handle task updates
  const handleTaskUpdate = async (taskData, taskId) => {
    setLoading(true);
    setError("");

    try {
      const url = taskId
        ? `http://localhost:8080/api/v1/tasks/update/${taskId}`
        : "http://localhost:8080/api/v1/tasks/add";
      const method = taskId ? "PUT" : "POST";

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
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        if (res.status === 401) {
          resetUser();
          navigate("/login");
          return;
        }
        throw new Error(`Server responded with status: ${res.status}`);
      }

      await fetchTasks();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating task:", error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/tasks/update/${taskId}`,
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
          body: JSON.stringify({ status: newStatus }),
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
      console.error("Error updating task status:", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  if (!user || !user._id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Not authenticated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <DashboardHeader
        user={user}
        logout={logout}
        openModal={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Welcome, {user?.username}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Here's an overview of your tasks
          </p>
        </div>

        {/* Dashboard stats */}
        <DashboardStats tasks={tasks} />

        {/* Search, filter and sort */}
        <FilterSortBar
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          clearSearch={clearSearch}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />

        {/* Task list */}
        <TaskList
          tasks={filteredAndSortedTasks}
          loading={loading}
          error={error}
          filter={filter}
          searchTerm={searchTerm}
          onDeleteTask={deleteTask}
          onEditTask={(task) => {
            setEditingTask(task);
            setIsModalOpen(true);
          }}
          onToggleStatus={toggleTaskStatus}
        />

        {/* Add task button (mobile) */}
        <AddTaskButton
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
        />

        {/* Task modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={editingTask}
          onSave={handleTaskUpdate}
        />
      </main>
    </div>
  );
}
