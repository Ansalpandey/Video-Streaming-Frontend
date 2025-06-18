import VideoScreen from "./components/VideoScreen";
import HomeScreen from "./components/HomeScreen";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/videos" element={<VideoScreen />} />
      </Routes>
    </Router>
  );
}
export default App;