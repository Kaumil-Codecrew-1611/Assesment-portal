import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../components/Loadable";

const Layout = Loadable(lazy(() => import("../components/Layout")));
const DashboardPage = Loadable(lazy(() => import("../views/Dashboard")));
const Questions = Loadable(lazy(() => import("../views/Questions/Questions")));
const ViewQuestions = Loadable(
  lazy(() => import("../views/Questions/ViewQuestions"))
);
const CreateQuestions = Loadable(
  lazy(() => import("../views/Create-questions/CreateQuestions"))
);
const ReportingUserQuestions = Loadable(
  lazy(() => import("../views/Questions/ReportingUserQuestions"))
);
const EditUserReview = Loadable(
  lazy(() => import("../views/Questions/EditUserReview"))
);

const MainRoutes = (user) => {
  return {
    path: "/",
    element: <Layout user={user} />,
    children: [
      {
        path: "/",
        element: user.isAuthenticated ? (
          <DashboardPage user={user} />
        ) : (
          <Navigate to="/auth/login" user={user} />
        ),
      },
      {
        path: "viewAssignment/:id",
        element: <ViewQuestions user={user} />,
      },
      {
        path: "reportingUserQuestions/:id",
        element: <ReportingUserQuestions user={user} />,
      },
      {
        path: "edit-user-review/:id",
        element: <EditUserReview user={user} />,
      },
      {
        path: "assignment/:id",
        element: <Questions user={user} />,
      },
      {
        path: "questions",
        element: <CreateQuestions user={user} />,
      },
    ],
  };
};

export default MainRoutes;
