import { Link } from "react-router";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
            <div className="container-fluid">
                <Link className="Navbar-brand" to="/">Interview Platform</Link>
                <button className="Navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="Navbar-toggle-icon"></span>
                </button>
                <div className="collapse navbar-collpase" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/signup">Signup</Link>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    )
}
export default Navbar