// components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  const navItemClasses = (path) =>
    `px-4 py-2 text-sm font-medium ${
      location.pathname === path
        ? "text-white border-b-2 border-blue-500"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-white font-bold text-xl">
            🎬 Stream Studio
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className={navItemClasses("/")}>
              Home
            </Link>
            <Link to="/upload" className={navItemClasses("/upload")}>
              Upload Video
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
