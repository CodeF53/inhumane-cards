import { Link } from "react-router-dom";

export function About() {
  return <div className="col centered page">
    <h1>About</h1>
    <h2> Who did this? </h2>
    <p>
      Made by <Link to="/contact">F53</Link> as a final project for my Software Development course.
      <br/>
      Yes. This was all made by a single person.
    </p>

    <h2> Why? </h2>
    <p>
      The only other options for playing Cards Against Humanity online are horrible.
    </p>

    <ul>
      <li>
        <a href="https://pyx-1.pretendyoure.xyz/zy/game.jsp">Pretend You're Xyzzy</a>

        <ul>
          <li>lacks style</li>
          <li>eye-searingly bright</li>
          <li>lacks unofficial expansions</li>
        </ul>
      </li>

      <li>
        <a href="https://store.steampowered.com/app/286160/Tabletop_Simulator/">TableTop Simulator</a>

        <ul>
          <li>painful controls</li>
          <li>overly complicated</li>
          <li>$20</li>
          <li>lacking most official and all unofficial expansions</li>
        </ul>
      </li>

      <li>
        <span>Everything Else</span>

        <ul>
          <li>I didn't know existed when I started the project</li>
        </ul>
      </li>
    </ul>

    <h2> How was this made? </h2>
    <p>
      The backend for this project is made with a Ruby on Rails backend and the frontend is made in React.js.
    </p>
  </div>
}