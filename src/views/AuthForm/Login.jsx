import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoCC from "../../assets/images/CC_Icon_1.png";
import { showToast } from "../../plugin/toastUtils";
import { loginAsync } from "../../store/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginUser = (e) => {
    e.preventDefault();
    try {
      dispatch(loginAsync({ email, password }));
      navigate("/");
    } catch (error) {
      console.log(error, "error");
      showToast(error.message, "error");
    } finally {
      navigate("/");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <div className="flex justify-center items-center gap-3">
                <div>
                  <img
                    src={logoCC}
                    alt="Your Company"
                    className="mx-auto h-10 w-auto"
                  />
                </div>
                <div>
                  <span className="text-white font-bold">CodeCrew </span>
                </div>
              </div>
              <h2 className="text-center text-white text-3xl font-bold leading-9 tracking-tight mt-6">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={loginUser}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={handleTogglePasswordVisibility}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    <Link
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                      to="/auth/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
