// eslint-disable-next-line no-unused-vars
import { Buffer } from "buffer/";
import { Othent } from "arweavekit/auth";
import { useContext } from "react";
import { GlobalContext } from "../context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { profile, setProfile } = useContext(GlobalContext);
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }

  async function handleDisconnect() {
    await Othent.logOut({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(null);
  }
  return (
    <div className="navbar bg-black drop-shadow-md h-14 fixed top-0 fixed top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown dropdown-hover">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul className="dropdown-content menu p-2 shadow bg-black rounded-box w-52">
            <li>
              <Link to="/upload">Drop a beat</Link>
            </li>
            <li>
              <Link to="/view">Jam to beats</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center md:flex">
        <Link
          to="/"
          className="btn btn-ghost normal-case text-3xl font-lobster text-white"
        >
          BeatDrop
        </Link>
      </div>
      <div className="navbar-end md:flex gap-4">
        {profile ? (
          <div className="flex justify-evenly items-center gap-2">
            <img src={profile.picture} className="w-12 h-12 rounded-md" />
            <button className="btn btn-ghost" disabled>
              {profile.name}
            </button>
            <button className="btn btn-ghost" onClick={handleDisconnect}>
              Log Out
            </button>
          </div>
        ) : (
          <button onClick={handleConnect} className="btn btn-ghost">
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
