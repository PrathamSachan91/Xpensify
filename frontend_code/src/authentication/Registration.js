import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { endpoint } from "../utils/APIRoutes";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Shared/Loader";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loding, setLoading] = useState(false);

  const initialValue = {
    full_name: "",
    email: "",
    mobile: "",
    password: "",
  };
  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,

    onSubmit: () => {
      const reqbody = {
        // wallet_address: walletAddress,
        full_name: fk.values.full_name,
        email: fk.values.email,
        mobile: fk.values.mobile,
        password: fk.values.password,
      };
      RegistrationFn(reqbody);
    },
  });
  const RegistrationFn = async (reqbody) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint?.registration_api, reqbody, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      toast(response?.data?.msg);
      setLoading(false);
      if (response?.data?.msg === "Registration Successfully") {
        fk.handleReset();
        localStorage.setItem("logindataen", response?.data?.token);
        navigate("/home");
        window.location.reload();
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      <Loader isLoading={loding} />
      <div className="flex min-h-screen bg-green-200 items-center justify-center">
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-10 text-center">Create an Account</h2>

          <div className="space-y-4">
            {/* Full Name and Email in two columns */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Full Name"

                id="full_name"
                name="full_name"
                value={fk.values.full_name}
                onChange={fk.handleChange}
                className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                id="email"
                name="email"
                value={fk.values.email}
                onChange={fk.handleChange}
                type="email"
                placeholder="Email Address"
                className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <input
              type="number"
              id="mobile"
              name="mobile"
              value={fk.values.mobile}
              onChange={fk.handleChange}
              placeholder="Mobile No"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {/* Password */}
            <div className="relative">
              <input
                placeholder="Password"
                id="password"
                value={fk.values.password}
                onChange={fk.handleChange}
                type={showPassword ? "text" : "password"}
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
              onClick={fk.handleSubmit}>
              SIGN UP
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <p className="text-green-600 font-semibold hover:underline"
                onClick={() => navigate('/')}>
                Login
              </p>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
