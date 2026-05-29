import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TripPage from "./pages/TripPage";
import TravelPage from "./pages/TravelPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-trip" element={<TripPage />} />
        <Route path="/travel" element={<TravelPage />} />
      </Routes>
    </Router> 
  );
}

export default App;
