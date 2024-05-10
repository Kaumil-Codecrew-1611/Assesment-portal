import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../components/Loadable";

const AuthLogin = Loadable(lazy(() => import("../views/AuthForm/Login")));
const AuthRegister = Loadable(
  lazy(() => import("../views/AuthForm/ForgotPassword"))
);

const AuthRoutes = (user) => {
  return {
    path: "/auth",
    children: [
      {
        path: "login",
        element: user.isAuthenticated ? <Navigate to="/" /> : <AuthLogin />,
      },
      {
        path: "forgot-password",
        element: <AuthRegister />,
      },
    ],
  };
};

export default AuthRoutes;
