import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import View from "./pages/View";
import { GlobalContext } from "./context";
import { useContext, useEffect, useState } from "react";

const ProfileRedirect = () => {
  const { profile } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      navigate("/view");
    } else {
      navigate("/");
    }
  }, [profile]);

  return null;
};

function App() {
  const [profile, setProfile] = useState();

  return (
    <Router>
      <div className="m-0 p-0 h-screen w-screen">
        <GlobalContext.Provider
          value={{
            profile,
            setProfile,
          }}
        >
          <ProfileRedirect />
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/view" element={<View />} />
          </Routes>
        </GlobalContext.Provider>
      </div>
    </Router>
  );
}

export default App;
