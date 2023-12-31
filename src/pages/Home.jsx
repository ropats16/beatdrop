import { Othent } from "arweavekit/auth";
import { useContext } from "react";
import { GlobalContext } from "../context";

function Home() {
  // Global setProfile function
  const { setProfile } = useContext(GlobalContext);
  // Log in function
  async function handleConnect() {
    const temp = await Othent.logIn({
      apiId: import.meta.env.VITE_OTHENT_API_ID,
    });
    setProfile(temp);
  }
  return (
    <div className="h-full w-full bg-white">
      <div className="h-full hero-content flex-col space-y-8">
        <h1 className="text-8xl font-bold hover:text-primary font-lobster self-center">
          BeatDrop
        </h1>
        <p className="text-2xl text-center">
          A decentralised audio sharing application on Arweave <br /> that
          allows you to drop beats <br /> as atomic assets.
        </p>
        <div className="flex space-x-4">
          <button className="btn btn-secondary" onClick={handleConnect}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
