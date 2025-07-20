import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from "formik";
import axios from "axios";
import { endpoint } from "../utils/APIRoutes";
import toast from "react-hot-toast";
import Loader from "../Shared/Loader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
 const initialValues = {
    username: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const reqBody = {
        username: values.username,
        password: values.password,
      };
      loginFn(reqBody);
    },
  });

  const loginFn = async (reqBody) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint?.login_api, reqBody, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      toast(response?.data?.msg);
      setLoading(false);
      if (response?.data?.msg === "Login successfully") {
        localStorage.setItem("logindataen", response?.data?.token);
        navigate("/home");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error during login.");
      setLoading(false);
    }
  };

  return (
   <>
    <Loader isLoading={loading} />
    <div className="flex min-h-screen bg-green-200 items-center justify-center">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="mb-6 text-gray-500 text-center">Please enter your details to log in</p>

        <div className="space-y-4">
          <input
            placeholder="Username"
                  type="text"
                  id="username"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
                placeholder="Password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
              className="w-full p-3 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}

            </button>
          </div>
          <button className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
           onClick={formik.handleSubmit}>
            LOGIN
          </button>
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <p className="text-green-600 font-semibold hover:underline"
              onClick={() => navigate("/register")}>
              SignUp
            </p>
          </p>
        </div>
      </div>
    </div>
   </>
  );
};

export default Login;