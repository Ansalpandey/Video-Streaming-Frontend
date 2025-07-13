import VideoScreen from "./components/VideoScreen";
import HomeScreen from "./components/HomeScreen";
import NavBar from "./components/NavBar";
import UploadScreen from "./components/UploadScreen";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/videos/:id" element={<VideoScreen />} />
        <Route path="/upload" element={<UploadScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
