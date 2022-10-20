import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { LoginSignup } from "../pages/LoginSignup";
import { Header } from "./Header";

export function App() {
  const [user, setUser] = useState(null)
  // auto-login
  useEffect(() => {fetch("/me").then((r) => { if (r.ok) {
    r.json().then((user) => setUser(user));
  }});}, []);


  return <div>
    <Header user={user} setUser={setUser} />

    <Routes>
      <Route path="/"       element={<Home/>} />
      <Route path="/game"/>

      <Route path="/login"  element={<LoginSignup isLogin={true}  user={user} setUser={setUser} />} />
      <Route path="/signup" element={<LoginSignup isLogin={false} user={user} setUser={setUser} />} />
    </Routes>
  </div>
}