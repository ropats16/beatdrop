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

// function to redirect users upon log in and log out
const ProfileRedirect = () => {
  // Global setProfile function
  const { profile } = useContext(GlobalContext);
  // react hook for page navigation
  const navigate = useNavigate();

  // useEffect checks for profile and routes to either the View or Home page
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
  // Global profile variable and setProfile function
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
          {/* routing between pages */}
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
