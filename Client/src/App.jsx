import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Circle,
  X,
  Calendar,
  AlertCircle,
  MoreVertical,
  Search,
  Menu as MenuIcon,
  ArrowDownUp,
} from "lucide-react";

// Create a unique ID for tasks
const generateId = () => Math.random().toString(36).substring(2, 9);



// Main App component
export default function App() {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchdata = async () => {
    
    const response = await fetch("http://localhost:8080/api/v1/tasks/gettask");
    const data = await response.json()
    console.log(data);
    setTasks(data.data)
  }
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    fetchdata()
  }, [tasks]);

  // Modal for adding/editing tasks
  const TaskModal = ({ isOpen, onClose, task }) => {
    const [formData, setFormData] = useState({
      title: task?.title || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      priority: task?.priority || "medium",
      category: task?.category || "Work",
      status: task?.status || "pending",
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title.trim()) return;

      if (task) {
        // Edit existing task
        setTasks(
          tasks.map((t) => (t.id === task.id ? { ...t, ...formData } : t))
        );
      } else {
        // Add new task
        setTasks([...tasks, { id: generateId(), ...formData }]);
      }
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Task title"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Task description"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                {task ? "Update" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Task Item Component
  const TaskItem = ({ task }) => {
    const priorityColors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    const categoryColors = {
      Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Personal:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Study:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Health: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };

    const isOverdue =
      task.status !== "completed" &&
      new Date(task.dueDate) < new Date() &&
      task.dueDate;

    const formatDate = (dateString) => {
      if (!dateString) return "No date";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    const toggleStatus = () => {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
    };

    const editTask = () => {
      setEditingTask(task);
      setIsModalOpen(true);
      setIsActionMenuOpen(false);
    };

    const deleteTask = () => {
      setTasks(tasks.filter((t) => t.id !== task.id));
      setIsActionMenuOpen(false);
    };

    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 border-l-4 hover:shadow-md transition-shadow ${
          task.status === "completed"
            ? "border-green-500 opacity-75"
            : isOverdue
            ? "border-red-500"
            : "border-blue-500"
        }`}
      >
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={toggleStatus}
              className="mt-1 flex-shrink-0 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
            >
              {task.status === "completed" ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Circle size={20} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-medium text-gray-800 dark:text-white flex items-center ${
                  task.status === "completed"
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : ""
                }`}
              >
                {task.title}
                {isOverdue && (
                  <span className="ml-2 text-xs inline-flex items-center font-medium text-red-600 dark:text-red-400">
                    <AlertCircle size={14} className="mr-1" />
                    Overdue
                  </span>
                )}
              </h3>

              {task.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {task.dueDate && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(task.dueDate)}
                  </div>
                )}

                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    categoryColors[task.category]
                  }`}
                >
                  {task.category}
                </div>
              </div>
            </div>
          </div>

          <div className="relative ml-2">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical size={16} />
            </button>

            {isActionMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={editTask}
                  className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={deleteTask}
                  className="flex w-full items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Add task button
  const AddTaskButton = () => (
    <button
      onClick={() => {
        setEditingTask(null);
        setIsModalOpen(true);
      }}
      className="fixed right-4 bottom-4 z-10 flex items-center justify-center w-14 h-14 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:hidden"
    >
      <Plus size={24} />
    </button>
  );

  // Dashboard stats
  const DashboardStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const pendingTasks = totalTasks - completedTasks;
    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        new Date(task.dueDate) < new Date() &&
        task.dueDate
    ).length;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Tasks
          </h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {totalTasks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Completed
          </h3>
          <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
            {completedTasks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Pending
          </h3>
          <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {pendingTasks}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Overdue
          </h3>
          <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
            {overdueTasks}
          </p>
        </div>
      </div>
    );
  };

  // Filter and sort the tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "completed") return task.status === "completed";
      if (filter === "pending") return task.status === "pending";
      if (filter === "overdue")
        return (
          task.status === "pending" &&
          new Date(task.dueDate) < new Date() &&
          task.dueDate
        );
      return task.category === filter;
    })
    .filter((task) => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Get unique categories
  const categories = ["Work", "Personal", "Study", "Health", "Other"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <CheckCircle className="h-6 w-6 text-blue-500 mr-2" />
                Task
              </h1>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="hidden md:flex space-x-10">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard stats */}
        <DashboardStats />

        {/* Search, filter and sort */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <optgroup label="Categories">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </optgroup>
              </select>

              <div className="flex items-center">
                <button
                  onClick={() =>
                    setSortBy(
                      sortBy === "dueDate"
                        ? "priority"
                        : sortBy === "priority"
                        ? "title"
                        : "dueDate"
                    )
                  }
                  className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Sort:{" "}
                  {sortBy === "dueDate"
                    ? "Due Date"
                    : sortBy === "priority"
                    ? "Priority"
                    : "Title"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task list */}
        <div>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => <TaskItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No tasks found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? "Try adjusting your search or filters."
                  : "Get started by adding a new task."}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setEditingTask(null);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Task
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add task floating button (mobile only) */}
      <AddTaskButton />

      {/* Task modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}



// import { useState, useEffect } from "react";
// import {
//   Bell,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Edit3,
//   Home,
//   LogOut,
//   Menu,
//   MoreVertical,
//   Plus,
//   Search,
//   Settings,
//   Trash2,
//   User,
//   X,
// } from "lucide-react";

// // Task status options
// const STATUS_OPTIONS = ["To Do", "In Progress", "Completed"];

// // Priority options with colors
// const PRIORITY_OPTIONS = [
//   { value: "Low", color: "bg-blue-500" },
//   { value: "Medium", color: "bg-yellow-500" },
//   { value: "High", color: "bg-red-500" },
// ];

// // Sample user data
// const USER = {
//   name: "Alex Johnson",
//   email: "alex.johnson@example.com",
//   avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=Alex",
//   role: "Team Lead",
//   tasksCompleted: 145,
//   tasksPending: 3,
// };

// // Sample initial tasks
// const INITIAL_TASKS = [
//   {
//     id: 1,
//     title: "Update project documentation",
//     description: "Review and update all project documentation for Q2 release",
//     status: "In Progress",
//     priority: "Medium",
//     dueDate: "2025-05-20",
//     createdAt: "2025-05-10",
//   },
//   {
//     id: 2,
//     title: "Fix navigation bug in mobile view",
//     description:
//       "Sidebar navigation doesn't collapse properly on mobile devices",
//     status: "To Do",
//     priority: "High",
//     dueDate: "2025-05-18",
//     createdAt: "2025-05-12",
//   },
//   {
//     id: 3,
//     title: "Team meeting preparation",
//     description: "Prepare slides and agenda for weekly team meeting",
//     status: "Completed",
//     priority: "Medium",
//     dueDate: "2025-05-14",
//     createdAt: "2025-05-11",
//   },
//   {
//     id: 4,
//     title: "Client presentation",
//     description: "Prepare and present quarterly results to client",
//     status: "To Do",
//     priority: "High",
//     dueDate: "2025-05-25",
//     createdAt: "2025-05-13",
//   },
// ];

// // Main App Component
// export default function TaskManagementApp() {
//   const [tasks, setTasks] = useState(() => {
//     // Load tasks from localStorage if available
//     const savedTasks = localStorage.getItem("tasks");
//     return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
//   });
//   const [currentTask, setCurrentTask] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [taskToDelete, setTaskToDelete] = useState(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Save tasks to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   // Apply filters and search to tasks
//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearch =
//       task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter =
//       activeFilter === "All" || task.status === activeFilter;
//     return matchesSearch && matchesFilter;
//   });

//   // Group tasks by status for board view
//   const tasksByStatus = STATUS_OPTIONS.reduce((acc, status) => {
//     acc[status] = filteredTasks.filter((task) => task.status === status);
//     return acc;
//   }, {});

//   // Task statistics
//   const taskStats = {
//     total: tasks.length,
//     completed: tasks.filter((task) => task.status === "Completed").length,
//     inProgress: tasks.filter((task) => task.status === "In Progress").length,
//     todo: tasks.filter((task) => task.status === "To Do").length,
//   };

//   // CRUD Operations
//   const addTask = (newTask) => {
//     const taskWithId = {
//       ...newTask,
//       id: tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
//       createdAt: new Date().toISOString().slice(0, 10),
//     };
//     setTasks([...tasks, taskWithId]);
//   };

//   const updateTask = (updatedTask) => {
//     setTasks(
//       tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
//     );
//   };

//   const deleteTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   const openEditModal = (task) => {
//     setCurrentTask(task);
//     setIsModalOpen(true);
//   };

//   const openAddModal = () => {
//     setCurrentTask(null);
//     setIsModalOpen(true);
//   };

//   const confirmDelete = (task) => {
//     setTaskToDelete(task);
//     setIsDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = () => {
//     if (taskToDelete) {
//       deleteTask(taskToDelete.id);
//       setIsDeleteModalOpen(false);
//       setTaskToDelete(null);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="flex justify-between items-center px-4 py-3">
//           <div className="flex items-center">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden mr-2 text-gray-600"
//             >
//               <Menu size={20} />
//             </button>
//             <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
//           </div>
//           <div className="hidden md:flex flex-1 max-w-md mx-4">
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Search size={16} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                 placeholder="Search tasks..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <button className="text-gray-500 hover:text-gray-700">
//               <Bell size={20} />
//             </button>
//             <div
//               className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer"
//               onClick={() => setIsProfileModalOpen(true)}
//             >
//               <User size={16} className="text-indigo-600" />
//             </div>
//           </div>
//         </div>
//         <div className="md:hidden px-4 pb-3">
//           <div className="relative w-full">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <Search size={16} className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//               placeholder="Search tasks..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside
//           className={`${
//             mobileMenuOpen
//               ? "fixed inset-0 z-40 bg-gray-800 bg-opacity-75"
//               : "hidden"
//           } md:relative md:block md:flex-shrink-0 md:w-56 bg-white border-r border-gray-200 ${
//             isSidebarOpen ? "" : "md:hidden"
//           }`}
//         >
//           <div className="h-full flex flex-col">
//             <div
//               className={`${
//                 mobileMenuOpen ? "bg-white w-3/4 h-full" : ""
//               } flex flex-col h-full p-4`}
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="font-semibold text-gray-700">Dashboard</h2>
//                 <button
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="md:hidden text-gray-500"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
//               <nav className="space-y-1">
//                 <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700">
//                   <Home size={16} className="mr-3" />
//                   <span>All Tasks</span>
//                 </button>
//                 {STATUS_OPTIONS.map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => {
//                       setActiveFilter(status);
//                       setMobileMenuOpen(false);
//                     }}
//                     className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
//                       activeFilter === status
//                         ? "bg-indigo-50 text-indigo-700"
//                         : "text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {status === "To Do" && <Clock size={16} className="mr-3" />}
//                     {status === "In Progress" && (
//                       <Calendar size={16} className="mr-3" />
//                     )}
//                     {status === "Completed" && (
//                       <CheckCircle size={16} className="mr-3" />
//                     )}
//                     <span>{status}</span>
//                     <span className="ml-auto bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
//                       {tasksByStatus[status]?.length || 0}
//                     </span>
//                   </button>
//                 ))}
//               </nav>

//               <div className="mt-auto pt-4 border-t border-gray-200">
//                 <button
//                   onClick={() => setIsProfileModalOpen(true)}
//                   className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
//                 >
//                   <User size={16} className="mr-3" />
//                   <span>Profile</span>
//                 </button>
//                 <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">
//                   <Settings size={16} className="mr-3" />
//                   <span>Settings</span>
//                 </button>
//                 <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50">
//                   <LogOut size={16} className="mr-3" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 overflow-auto p-4">
//           {/* Dashboard Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white rounded-lg shadow p-4 flex items-center">
//               <div className="rounded-full bg-blue-100 p-2 mr-4">
//                 <Clock size={20} className="text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">To Do</p>
//                 <p className="text-xl font-semibold">{taskStats.todo}</p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow p-4 flex items-center">
//               <div className="rounded-full bg-yellow-100 p-2 mr-4">
//                 <Calendar size={20} className="text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">In Progress</p>
//                 <p className="text-xl font-semibold">{taskStats.inProgress}</p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow p-4 flex items-center">
//               <div className="rounded-full bg-green-100 p-2 mr-4">
//                 <CheckCircle size={20} className="text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Completed</p>
//                 <p className="text-xl font-semibold">{taskStats.completed}</p>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow p-4 flex items-center">
//               <div className="rounded-full bg-purple-100 p-2 mr-4">
//                 <CheckCircle size={20} className="text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Total</p>
//                 <p className="text-xl font-semibold">{taskStats.total}</p>
//               </div>
//             </div>
//           </div>

//           {/* Filter and Add Task Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//             <div className="flex items-center space-x-2 mb-4 sm:mb-0">
//               <button
//                 onClick={() => setActiveFilter("All")}
//                 className={`px-3 py-1 text-sm rounded-md ${
//                   activeFilter === "All"
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-100 text-gray-600"
//                 }`}
//               >
//                 All
//               </button>
//               {STATUS_OPTIONS.map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setActiveFilter(status)}
//                   className={`hidden sm:block px-3 py-1 text-sm rounded-md ${
//                     activeFilter === status
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={openAddModal}
//               className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm transition-colors"
//             >
//               <Plus size={16} className="mr-1" />
//               <span>Add Task</span>
//             </button>
//           </div>

//           {/* Task Board */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {STATUS_OPTIONS.map((status) => (
//               <div key={status} className="bg-white rounded-lg shadow">
//                 <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//                   <div className="flex items-center">
//                     {status === "To Do" && (
//                       <Clock size={16} className="text-gray-500 mr-2" />
//                     )}
//                     {status === "In Progress" && (
//                       <Calendar size={16} className="text-gray-500 mr-2" />
//                     )}
//                     {status === "Completed" && (
//                       <CheckCircle size={16} className="text-gray-500 mr-2" />
//                     )}
//                     <h3 className="font-medium">{status}</h3>
//                     <span className="ml-2 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
//                       {tasksByStatus[status]?.length || 0}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
//                   {tasksByStatus[status]?.length > 0 ? (
//                     tasksByStatus[status].map((task) => (
//                       <div
//                         key={task.id}
//                         className="bg-gray-50 rounded-md p-3 shadow-sm"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <h4 className="font-medium text-gray-800">
//                             {task.title}
//                           </h4>
//                           <div className="flex items-center">
//                             <div
//                               className={`h-2 w-2 rounded-full mr-2 ${
//                                 task.priority === "High"
//                                   ? "bg-red-500"
//                                   : task.priority === "Medium"
//                                   ? "bg-yellow-500"
//                                   : "bg-blue-500"
//                               }`}
//                             />
//                             <span className="text-xs text-gray-500">
//                               {task.priority}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                           {task.description}
//                         </p>
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center">
//                             <Calendar
//                               size={14}
//                               className="text-gray-400 mr-1"
//                             />
//                             <span className="text-xs text-gray-500">
//                               Due: {new Date(task.dueDate).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => openEditModal(task)}
//                               className="p-1 text-gray-500 hover:text-indigo-600"
//                             >
//                               <Edit3 size={14} />
//                             </button>
//                             <button
//                               onClick={() => confirmDelete(task)}
//                               className="p-1 text-gray-500 hover:text-red-600"
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-4">
//                       <p className="text-gray-500 text-sm">No tasks</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </main>
//       </div>

//       {/* Task Modal */}
//       {isModalOpen && (
//         <TaskModal
//           task={currentTask}
//           onClose={() => setIsModalOpen(false)}
//           onSave={(task) => {
//             if (task.id) {
//               updateTask(task);
//             } else {
//               addTask(task);
//             }
//             setIsModalOpen(false);
//           }}
//         />
//       )}

//       {/* Profile Modal */}
//       {isProfileModalOpen && (
//         <ProfileModal
//           user={USER}
//           taskStats={taskStats}
//           onClose={() => setIsProfileModalOpen(false)}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && (
//         <DeleteConfirmationModal
//           task={taskToDelete}
//           onCancel={() => {
//             setIsDeleteModalOpen(false);
//             setTaskToDelete(null);
//           }}
//           onConfirm={handleDeleteConfirm}
//         />
//       )}
//     </div>
//   );
// }

// // Task Modal Component
// function TaskModal({ task, onClose, onSave }) {
//   const [formData, setFormData] = useState(
//     task
//       ? { ...task }
//       : {
//           title: "",
//           description: "",
//           status: "To Do",
//           priority: "Medium",
//           dueDate: new Date().toISOString().slice(0, 10),
//         }
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
//           <h3 className="font-semibold text-lg text-gray-800">
//             {task ? "Edit Task" : "Add New Task"}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {STATUS_OPTIONS.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 {PRIORITY_OPTIONS.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.value}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <input
//               type="date"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//             />
//           </div>
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//             >
//               {task ? "Save Changes" : "Add Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // Profile Modal Component
// function ProfileModal({ user, taskStats, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
//           <h3 className="font-semibold text-lg text-gray-800">Profile</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-6">
//           <div className="flex flex-col items-center mb-6">
//             <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
//               <User size={48} className="text-indigo-600" />
//             </div>
//             <h4 className="text-xl font-semibold text-gray-800">{user.name}</h4>
//             <p className="text-gray-500">{user.role}</p>
//             <p className="text-gray-500 text-sm">{user.email}</p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="bg-indigo-50 p-4 rounded-lg text-center">
//               <p className="text-indigo-700 text-2xl font-bold">
//                 {taskStats.completed}
//               </p>
//               <p className="text-gray-600 text-sm">Tasks Completed</p>
//             </div>
//             <div className="bg-indigo-50 p-4 rounded-lg text-center">
//               <p className="text-indigo-700 text-2xl font-bold">
//                 {taskStats.inProgress + taskStats.todo}
//               </p>
//               <p className="text-gray-600 text-sm">Tasks Pending</p>
//             </div>
//           </div>

//           <div className="border-t border-gray-200 pt-4">
//             <h5 className="font-medium text-gray-700 mb-3">Activity</h5>
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Tasks Created</span>
//                 <span className="text-sm font-medium">{taskStats.total}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Completion Rate</span>
//                 <span className="text-sm font-medium">
//                   {taskStats.total > 0
//                     ? Math.round((taskStats.completed / taskStats.total) * 100)
//                     : 0}
//                   %
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Delete Confirmation Modal
// function DeleteConfirmationModal({ task, onCancel, onConfirm }) {
//   if (!task) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         <div className="p-6">
//           <div className="flex items-center justify-center text-red-500 mb-4">
//             <Trash2 size={40} />
//           </div>
//           <h3 className="text-lg font-semibold text-center mb-2">
//             Delete Task
//           </h3>
//           <p className="text-gray-600 text-center mb-6">
//             Are you sure you want to delete "
//             <span className="font-medium">{task.title}</span>"? This action
//             cannot be undone.
//           </p>
//           <div className="flex justify-center space-x-3">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

