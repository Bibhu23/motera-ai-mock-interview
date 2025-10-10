import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/Appcontext";
import motera_logo from "../components/motera_logo.png"

function Navbar() {
  const { credit, login, logoutUser } = useContext(AppContext);

  const handleLogout = () => logoutUser();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
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
            {/* <div>
              <div className="fw-bold fs-5">Motera</div>
              <div className="fs-6">Mock Interview Platform</div>
            </div> */}
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/features">Features</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/features#works">How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/features#feedback">Success Stories</a>
              </li>

              {login ? (
                <>
                  <li className="nav-item">
                    <button className="btn btn-danger nav-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Sign In</Link>
                </li>
              )}

              <li className="nav-item">
                <Link
                  className="nav-link btn btn-primary ms-2 d-flex align-items-center"
                  to="/signup"
                >
                  <span className="me-2">🚀</span>
                  Start Free Trial
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Floating corner credit badge */}
      {login && (
        <div className="position-fixed bottom-0 end-0 m-3 p-2 px-3 bg-info text-white rounded-pill shadow">
          Credits: {credit}
        </div>
      )}
    </>
  );
}

export default Navbar;
