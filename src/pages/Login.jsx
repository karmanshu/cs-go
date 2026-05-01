import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BookOpen } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    login(username.trim());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            {/* <BookOpen className="w-12 h-12 text-blue-600" /> */}
            <img
              src="public\cs-go.png"
              alt="CS-GO Logo"
              width="48"
              height="48"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          CS-GO: NIMCET MockTest
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600"></p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
              >
                Start Practicing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
