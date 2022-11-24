import { Link } from "react-router-dom";

export function Legal() {
  return <div className="col centered page">
    <h1>Legal</h1>
    <h2>How can you just totally rip of Cards Against Humanity?</h2>
    <p>
      Cards Against Humanity® is distributed under a <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons BY-NC-SA 4.0 license</a>.
      <br/>
      So basically anyone can do anything with their cards as long as proper credit is given and it isn't commercial
    </p>

    <h2>What about all the other unofficial expansions you use?</h2>
    <p>
      Honestly I have no idea if I am legally in the right here.
      <br/>
      I have messaged all of the creators of the unofficial expansions I use, and I will update the site as they respond.
    </p>

    <h2>What about the font you are using?</h2>
    <p>
      I use <a href="https://www.linotype.com/1264130/neue-helvetica-75-bold-product.html">Helvetica® Neue 75 Bold</a>,
      you cant prove I haven't paid for it.
    </p>

    <h2>You are doing something and I don't like it</h2>
    <p>
      Feel free to get in <Link to="/contact">contact</Link> with me!
    </p>
  </div>
}