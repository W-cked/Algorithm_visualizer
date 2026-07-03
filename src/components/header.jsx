import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import styles from "../css/Header.module.css";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Safely handle localStorage data parsing
    const data = JSON.parse(localStorage.getItem("userInfo")) || {};
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Apply saved theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.body.classList.toggle(
            "light-theme",
            savedTheme === "light"
        );
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.body.classList.toggle(
            "light-theme",
            newTheme === "light"
        );
    };

    return (
        <header className={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 className={styles.logo} style={{ margin: 0 }}>
                        Algo<span className={styles.logoAccent}>Visualizer</span>
                    </h1>
                </Link>
                
                {/* Public Navigation Links */}
                <nav style={{ display: "flex", gap: "16px", marginLeft: "16px" }}>
                    <Link to="/about" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500 }}>About</Link>
                    <Link to="/benefits" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500 }}>Benefits</Link>
                    <Link to="/contact" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.95rem", fontWeight: 500 }}>Contact</Link>
                </nav>
            </div>

            {/* Right: Actions */}
            <div className={styles.navActions}>
                <button
                    onClick={toggleTheme}
                    className={styles.themeToggle}
                    aria-label="Toggle theme"
                >
                    <span className={styles.themeIcon}>
                        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                    </span>
                </button>

                {data.user ? (
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button 
                            onClick={() => navigate("/dashboard")}
                            style={{ padding: "8px 16px", background: "var(--glass-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", cursor: "pointer", fontWeight: 600 }}
                        >
                            Go to App
                        </button>
                        <div className={styles.profileSection} onClick={() => navigate("/Profile")}>
                            <img src="/userProfile.png" alt="Profile" className={styles.profileAvatar} />
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/Auth")}
                        className={styles.loginButton}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
