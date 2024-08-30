import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import PrivateLayout from "./components/layout/PrivateLayout";
import PublicLayout from "./components/layout/PublicLayout";
import Home from "./components/Home";
import Users from "./components/Users";
import NewUser from "./components/NewUser";
import UpdateUser from "./components/UpdateUser";
import Profile from "./components/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/create-user" element={<NewUser />} />
          <Route path="/users/update-user/:id" element={<UpdateUser />} />
          <Route path="/setting" />
          <Route path="/reports" />
          <Route path="/profile" element={<Profile />} />
          <Route path="/data-entries" />
          <Route path="/team-management" />
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
