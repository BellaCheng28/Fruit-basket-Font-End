// SigninForm

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService"; // import the authservice

const SigninForm = (props) => {
  const navigate = useNavigate(); // added this for navigation purposes
  const [message, setMessage] = useState([""]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 显示加载状态或其他准备工作
    updateMessage(""); // 清除之前的错误信息

    try {
      const response = await authService.signin(formData);

      if (response.success) {
        // 登录成功，设置用户信息，并跳转到主页
        props.setUser(response.user);
        navigate("/home");
      } else {
        // 登录失败，显示返回的错误信息
        updateMessage(
          response.message || "Invalid credentials. Please try again."
        );
      }
    } catch (err) {
      // 捕获所有其他异常并显示
      updateMessage(err.message || "Something went wrong, please try again.");
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <p className="text-red-500 text-center mb-4">{message}</p>
        <form autoComplete="off" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              autoComplete="off"
              id="username"
              value={formData.username}
              name="username"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
              focus:ring-green-700 focus:border-green-700  sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none
              focus:ring-green-700 focus:border-green-700  sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 disabled:bg-gray-400"
            >
              Sign In
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/home">
              <button
                type="button"
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SigninForm;
