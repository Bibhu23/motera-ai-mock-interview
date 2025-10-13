import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext";
import motera_logo from "../components/motera_logo.png";

function Navbar() {
  const { credit, login, logoutUser } = useContext(AppContext);

  const handleLogout = () => logoutUser();

  return (
    <nav className="navbar bg-dark navbar-dark px-4">
      <div className="d-flex align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={motera_logo}
            alt="Motera Logo"
            style={{
              width: "150px",
              height: "70px",
              marginRight: "10px",
              borderRadius: "8px",
            }}
          />
        </Link>
      </div>

      <ul className="navbar-nav flex-row ms-auto">
        <li className="nav-item mx-3">
          <Link className="nav-link text-white" to="/features">
            Features
          </Link>
        </li>
        <li className="nav-item mx-3">
          <a className="nav-link text-white" href="/features#works">
            How It Works
          </a>
        </li>
        <li className="nav-item mx-3">
          <a className="nav-link text-white" href="/features#feedback">
            Success Stories
          </a>
        </li>

        {login ? (
          <li className="nav-item mx-3">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li className="nav-item mx-3">
            <Link className="nav-link text-white" to="/login">
              Sign In
            </Link>
          </li>
        )}

        <li className="nav-item mx-3">
          <Link className="btn btn-primary" to="/signup">
            🚀 Start Free Trial
          </Link>
        </li>
      </ul>

      {login && (
        <div className="position-fixed bottom-0 end-0 m-3 p-2 px-3 bg-info text-white rounded-pill shadow">
          Credits: {credit}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
