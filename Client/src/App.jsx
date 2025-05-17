// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Trash2,
//   Edit,
//   CheckCircle,
//   Circle,
//   X,
//   Calendar,
//   AlertCircle,
//   MoreVertical,
//   Search,
//   Menu as MenuIcon,
//   ArrowDownUp,
// } from "lucide-react";

// // Create a unique ID for tasks
// const generateId = () => Math.random().toString(36).substring(2, 9);



// // Main App component
// export default function App() {
//   const [tasks, setTasks] = useState([])
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingTask, setEditingTask] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("dueDate");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuOpen, setMenuOpen] = useState(false);

//   const fetchdata = async () => {
    
//     const response = await fetch("http://localhost:8080/api/v1/tasks/gettask");
//     const data = await response.json()
//     console.log(data);
//     setTasks(data.data)
//   }
//   // Save tasks to localStorage whenever they change
//   useEffect(() => {
//     fetchdata()
//   }, [tasks]);

//   // Modal for adding/editing tasks
//   const TaskModal = ({ isOpen, onClose, task }) => {
//     const [formData, setFormData] = useState({
//       title: task?.title || "",
//       description: task?.description || "",
//       dueDate: task?.dueDate || "",
//       priority: task?.priority || "medium",
//       category: task?.category || "Work",
//       status: task?.status || "pending",
//     });

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       if (!formData.title.trim()) return;

//       if (task) {
//         // Edit existing task
//         setTasks(
//           tasks.map((t) => (t.id === task.id ? { ...t, ...formData } : t))
//         );
//       } else {
//         // Add new task
//         setTasks([...tasks, { id: generateId(), ...formData }]);
//       }
//       onClose();
//     };

//     if (!isOpen) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
//           <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
//               {task ? "Edit Task" : "Add New Task"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-4">
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 placeholder="Task title"
//                 required
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 placeholder="Task description"
//                 rows="3"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Due Date
//                 </label>
//                 <input
//                   type="date"
//                   name="dueDate"
//                   value={formData.dueDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Priority
//                 </label>
//                 <select
//                   name="priority"
//                   value={formData.priority}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   <option value="Work">Work</option>
//                   <option value="Personal">Personal</option>
//                   <option value="Study">Study</option>
//                   <option value="Health">Health</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Status
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
//               >
//                 {task ? "Update" : "Add Task"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   // Task Item Component
//   const TaskItem = ({ task }) => {
//     const priorityColors = {
//       low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//       medium:
//         "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
//       high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
//     };

//     const categoryColors = {
//       Work: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
//       Personal:
//         "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
//       Study:
//         "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
//       Health: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
//       Other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
//     };

//     const isOverdue =
//       task.status !== "completed" &&
//       new Date(task.dueDate) < new Date() &&
//       task.dueDate;

//     const formatDate = (dateString) => {
//       if (!dateString) return "No date";
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     };

//     const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

//     const toggleStatus = () => {
//       const newStatus = task.status === "completed" ? "pending" : "completed";
//       setTasks(
//         tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
//       );
//     };

//     const editTask = () => {
//       setEditingTask(task);
//       setIsModalOpen(true);
//       setIsActionMenuOpen(false);
//     };

//     const deleteTask = () => {
//       setTasks(tasks.filter((t) => t.id !== task.id));
//       setIsActionMenuOpen(false);
//     };

//     return (
//       <div
//         className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-3 border-l-4 hover:shadow-md transition-shadow ${
//           task.status === "completed"
//             ? "border-green-500 opacity-75"
//             : isOverdue
//             ? "border-red-500"
//             : "border-blue-500"
//         }`}
//       >
//         <div className="p-4 flex items-start justify-between">
//           <div className="flex items-start space-x-3 flex-1">
//             <button
//               onClick={toggleStatus}
//               className="mt-1 flex-shrink-0 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
//             >
//               {task.status === "completed" ? (
//                 <CheckCircle size={20} className="text-green-500" />
//               ) : (
//                 <Circle size={20} />
//               )}
//             </button>

//             <div className="flex-1 min-w-0">
//               <h3
//                 className={`font-medium text-gray-800 dark:text-white flex items-center ${
//                   task.status === "completed"
//                     ? "line-through text-gray-500 dark:text-gray-400"
//                     : ""
//                 }`}
//               >
//                 {task.title}
//                 {isOverdue && (
//                   <span className="ml-2 text-xs inline-flex items-center font-medium text-red-600 dark:text-red-400">
//                     <AlertCircle size={14} className="mr-1" />
//                     Overdue
//                   </span>
//                 )}
//               </h3>

//               {task.description && (
//                 <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
//                   {task.description}
//                 </p>
//               )}

//               <div className="mt-2 flex flex-wrap items-center gap-2">
//                 {task.dueDate && (
//                   <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                     <Calendar size={14} className="mr-1" />
//                     {formatDate(task.dueDate)}
//                   </div>
//                 )}

//                 <div
//                   className={`text-xs px-2 py-1 rounded-full ${
//                     categoryColors[task.category]
//                   }`}
//                 >
//                   {task.category}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="relative ml-2">
//             <button
//               onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
//               className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               <MoreVertical size={16} />
//             </button>

//             {isActionMenuOpen && (
//               <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 border border-gray-200 dark:border-gray-700">
//                 <button
//                   onClick={editTask}
//                   className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   <Edit size={14} className="mr-2" />
//                   Edit
//                 </button>
//                 <button
//                   onClick={deleteTask}
//                   className="flex w-full items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 >
//                   <Trash2 size={14} className="mr-2" />
//                   Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Add task button
//   const AddTaskButton = () => (
//     <button
//       onClick={() => {
//         setEditingTask(null);
//         setIsModalOpen(true);
//       }}
//       className="fixed right-4 bottom-4 z-10 flex items-center justify-center w-14 h-14 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 lg:hidden"
//     >
//       <Plus size={24} />
//     </button>
//   );

//   // Dashboard stats
//   const DashboardStats = () => {
//     const totalTasks = tasks.length;
//     const completedTasks = tasks.filter(
//       (task) => task.status === "completed"
//     ).length;
//     const pendingTasks = totalTasks - completedTasks;
//     const overdueTasks = tasks.filter(
//       (task) =>
//         task.status !== "completed" &&
//         new Date(task.dueDate) < new Date() &&
//         task.dueDate
//     ).length;

//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             Total Tasks
//           </h3>
//           <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
//             {totalTasks}
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             Completed
//           </h3>
//           <p className="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">
//             {completedTasks}
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             Pending
//           </h3>
//           <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
//             {pendingTasks}
//           </p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
//           <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             Overdue
//           </h3>
//           <p className="mt-1 text-2xl font-semibold text-red-600 dark:text-red-400">
//             {overdueTasks}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Filter and sort the tasks
//   const filteredTasks = tasks
//     .filter((task) => {
//       if (filter === "all") return true;
//       if (filter === "completed") return task.status === "completed";
//       if (filter === "pending") return task.status === "pending";
//       if (filter === "overdue")
//         return (
//           task.status === "pending" &&
//           new Date(task.dueDate) < new Date() &&
//           task.dueDate
//         );
//       return task.category === filter;
//     })
//     .filter((task) => {
//       if (!searchQuery) return true;
//       return (
//         task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         task.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     });

//   const sortedTasks = [...filteredTasks].sort((a, b) => {
//     if (sortBy === "dueDate") {
//       if (!a.dueDate) return 1;
//       if (!b.dueDate) return -1;
//       return new Date(a.dueDate) - new Date(b.dueDate);
//     }
//     if (sortBy === "priority") {
//       const priorityOrder = { high: 0, medium: 1, low: 2 };
//       return priorityOrder[a.priority] - priorityOrder[b.priority];
//     }
//     if (sortBy === "title") {
//       return a.title.localeCompare(b.title);
//     }
//     return 0;
//   });

//   // Get unique categories
//   const categories = ["Work", "Personal", "Study", "Health", "Other"];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <header className="bg-white dark:bg-gray-800 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
//             <div className="flex justify-start lg:w-0 lg:flex-1">
//               <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
//                 <CheckCircle className="h-6 w-6 text-blue-500 mr-2" />
//                 Task
//               </h1>
//             </div>

//             <div className="md:hidden">
//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//               >
//                 <MenuIcon className="h-6 w-6" />
//               </button>
//             </div>

//             <nav className="hidden md:flex space-x-10">
//               <button
//                 onClick={() => {
//                   setEditingTask(null);
//                   setIsModalOpen(true);
//                 }}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 New Task
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
//           <div className="pt-2 pb-3 space-y-1">
//             <button
//               onClick={() => {
//                 setEditingTask(null);
//                 setIsModalOpen(true);
//                 setMenuOpen(false);
//               }}
//               className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               New Task
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Dashboard stats */}
//         <DashboardStats />

//         {/* Search, filter and sort */}
//         <div className="mb-6 space-y-4">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="relative flex-1">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search tasks..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="all">All Tasks</option>
//                 <option value="pending">Pending</option>
//                 <option value="completed">Completed</option>
//                 <option value="overdue">Overdue</option>
//                 <optgroup label="Categories">
//                   {categories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </optgroup>
//               </select>

//               <div className="flex items-center">
//                 <button
//                   onClick={() =>
//                     setSortBy(
//                       sortBy === "dueDate"
//                         ? "priority"
//                         : sortBy === "priority"
//                         ? "title"
//                         : "dueDate"
//                     )
//                   }
//                   className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
//                 >
//                   <ArrowDownUp className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
//                   Sort:{" "}
//                   {sortBy === "dueDate"
//                     ? "Due Date"
//                     : sortBy === "priority"
//                     ? "Priority"
//                     : "Title"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Task list */}
//         <div>
//           {sortedTasks.length > 0 ? (
//             sortedTasks.map((task) => <TaskItem key={task.id} task={task} />)
//           ) : (
//             <div className="text-center py-12">
//               <div className="flex justify-center">
//                 <CheckCircle className="h-12 w-12 text-gray-400 dark:text-gray-600" />
//               </div>
//               <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
//                 No tasks found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//                 {searchQuery
//                   ? "Try adjusting your search or filters."
//                   : "Get started by adding a new task."}
//               </p>
//               {!searchQuery && (
//                 <div className="mt-6">
//                   <button
//                     onClick={() => {
//                       setEditingTask(null);
//                       setIsModalOpen(true);
//                     }}
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     New Task
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Add task floating button (mobile only) */}
//       <AddTaskButton />

//       {/* Task modal */}
//       <TaskModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         task={editingTask}
//       />
//     </div>
//   );
// }

import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;