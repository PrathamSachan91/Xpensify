import axios from "axios";
import toast from "react-hot-toast";
import { frontend } from "./APIRoutes";
// import { fron_end_main_domain } from "./urls";
// import toast from "react-hot-toast";

export const apiConnectorGet = async (endpoint, params) => {
  console.log("Params being sent:", params);
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("logindataen")}`,
      },
      params: params, // ✅ Move this inside same config object
    });

    if (response?.data?.msg === "Invalid Token.") {
      toast("Login in another device ", { id: 1 });
      localStorage.clear();
      window.location.href = `${frontend}`;
      return;
    }

    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};

export const apiConnectorPost = async (endpoint, reqBody) => {
  try {
    const response = await axios?.post(
      endpoint,
      reqBody,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("logindataen")}`,
        },
      }   
    );
    if (response?.data?.msg === "Invalid Token.") {
      toast("Login in another device ", { id: 1 });
      localStorage.clear();
      window.location.href = `${frontend}`;
      return;
    }
    return response;
  } catch (e) {
    return {
      msg: e?.message,
    };
  }
};