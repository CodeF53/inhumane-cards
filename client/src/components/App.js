import { Fragment, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CreateLobby } from "../pages/CreateLobby";
import { Game } from "../pages/Game";
import { Home } from "../pages/Home";
import { Lobbies } from "../pages/Lobbies";
import { LoginSignup } from "../pages/LoginSignup";
import { Header } from "./Header";

export function App() {
  // TODO: switch to persistent state for user
  const [user, setUser] = useState(null)
  // auto-login
  useEffect(() => {fetch("/me").then((r) => { if (r.ok) {
    r.json().then((user) => setUser(user));
  }});}, []);


  return <div className="app">
    <Routes>
      <Route path="/game/" element={<Game user={user}/>}/>

      <Route path="*" element={<Fragment>
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/lobbies"      element={<Lobbies user={user} />} />
          <Route path="/create_lobby" element={<CreateLobby user={user} />} />

          <Route path="/login"  element={<LoginSignup isLogin={true}  user={user} setUser={setUser} />} />
          <Route path="/signup" element={<LoginSignup isLogin={false} user={user} setUser={setUser} />} />
        </Routes>
      </Fragment>}/>
    </Routes>
  </div>
}