import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                {/* Logo as AI icon + text */}
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span
                        style={{
                            fontSize: '28px',
                            marginRight: '10px',
                            color: '#0dcaf0' // accent color for AI icon
                        }}
                    >
                        🤖
                    </span>
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Motera</div>
                        <div style={{ fontSize: '12px' }}>Mock Interview Platform</div>
                    </div>
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
                            <Link className="nav-link" to="/how-it-works">How It Works</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/success-stories">Success Stories</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Sign In</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-primary text-white ms-2 d-flex align-items-center"
                                to="/signup"
                                style={{ padding: '8px 16px' }}
                            >
                                <span style={{ marginRight: '8px', fontSize: '16px' }}>🚀</span>
                                Start Free Trial
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
