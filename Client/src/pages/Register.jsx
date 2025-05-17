import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
}


// import React, { useState } from "react";
// import { User, Mail, Lock, ArrowRight } from "lucide-react";

// // Mock navigate function since react-router-dom is unavailable
// const mockNavigate = (path) => {
//   console.log(`Navigating to: ${path}`);
//   // In a real app, this would use react-router's navigate
// };

// export default function Register() {
//   const [form, setForm] = useState({ username: "", email: "", password: "" });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:8080/api/v1/users/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     if (res.ok) mockNavigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-sm text-gray-600">Join our community today</p>
//         </div>

//         <div className="mt-8 space-y-6">
//           <div className="space-y-4 rounded-md shadow-sm">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 name="username"
//                 type="text"
//                 required
//                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Username"
//                 onChange={handleChange}
//                 value={form.username}
//               />
//             </div>

//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Email address"
//                 onChange={handleChange}
//                 value={form.email}
//               />
//             </div>

//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 name="password"
//                 type="password"
//                 required
//                 className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 value={form.password}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               onClick={handleSubmit}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                 <ArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
//               </span>
//               Register
//             </button>
//           </div>

//           <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <a
//                 href="#"
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   mockNavigate("/login");
//                 }}
//               >
//                 Sign in
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }