import { useRoutes } from "react-router-dom";
import "./App.css";
import MainRoutes from "./routes/MainRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user);
  const Routing = useRoutes([AuthRoutes(user), MainRoutes(user)]);
  return (
    <>
      {Routing}
      <Toaster />
    </>
  );
}

export default App;
