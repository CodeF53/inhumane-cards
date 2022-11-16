import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { About } from "../pages/About";
import { Contact } from "../pages/Contact";
import { CreateLobby } from "../pages/CreateLobby";
import { Credits } from "../pages/Credits";
import Disclaimer from "../pages/Disclaimer";
import { Game } from "../pages/Game";
import { Home } from "../pages/Home";
import { JoinLobby } from "../pages/JoinLobby";
import Kicked from "../pages/Kicked";
import { Legal } from "../pages/Legal";
import { LoginSignup } from "../pages/LoginSignup";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function App({ cable }) {
  // persistent user through local storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
  useEffect(() => { localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  // auto-login (incase cookie expired or something)
  useEffect(() => {fetch("/me").then((r) => {
    if (r.ok) { r.json().then((user) => setUser(user)); }
    else { setUser(null) }
  });}, []);

  // calculate aspect ratio every resize
  // do Mobile Rendering when aspect ratio is less than 3:4 -> (3:4 -> 3/4 -> 0.75)
  const getIsMobile = () => (window.innerWidth / window.innerHeight) < 0.75
  const [isMobile, setIsMobile] = useState(getIsMobile())
  useEffect(() => {
    const handleWindowResize = () => setIsMobile(getIsMobile())
    window.addEventListener("resize", handleWindowResize)
    return () => { window.removeEventListener("resize", handleWindowResize) }
  }, [])

  // clear phantom cable subscriptions
  cable.subscriptions.subscriptions = []

  return <div className={`app ${isMobile?"mobile":"desktop"}`}>
    <Routes>
      <Route path="/game/:game_id" element={<Game user={user} cable={cable}/>}/>

      <Route path="*" element={<div className="col">
        <Header user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/join_lobby"      element={<JoinLobby user={user} />} />
          <Route path="/create_lobby" element={<CreateLobby user={user} />} />

          <Route path="/login"  element={<LoginSignup isLogin={true}  user={user} setUser={setUser} />} />
          <Route path="/signup" element={<LoginSignup isLogin={false} user={user} setUser={setUser} />} />

          <Route path="/contact" element={<Contact/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/legal" element={<Legal/>} />
          <Route path="/credits" element={<Credits/>} />
          <Route path="/disclaimer" element={<Disclaimer/>} />

          <Route path="/kicked" element={<Kicked/>} />
        </Routes>

        <div className="spacer"/>
        <Footer/>
      </div>}/>
    </Routes>
  </div>
}