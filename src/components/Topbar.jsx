import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Sun, Moon, Bell, User } from "lucide-react";
import styles from "../css/Topbar.module.css";

const Topbar = ({ toggleSidebar, isSidebarOpen }) => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, [location]);

    // Generate a simple breadcrumb from the pathname
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumb = pathSegments.length > 0 
        ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ')
        : "Dashboard";

    return (
        <header className={styles.topbar}>
            <div className={styles.leftSection}>
                <button 
                    onClick={toggleSidebar} 
                    className={styles.iconButton} 
                    style={{ marginRight: '16px' }}
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div className={styles.breadcrumb}>
                    <span style={{ color: 'var(--text-muted)' }}>App / </span>
                    <span style={{ textTransform: 'capitalize' }}>{breadcrumb}</span>
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}><Search size={16} /></span>
                    <input 
                        type="text" 
                        className={styles.searchInput} 
                        placeholder="Search algorithms..." 
                    />
                </div>

                <button 
                    className={styles.iconButton} 
                    onClick={() => {
                        const newTheme = theme === "dark" ? "light" : "dark";
                        setTheme(newTheme);
                        localStorage.setItem("theme", newTheme);
                        if (newTheme === "light") {
                            document.body.classList.add("light-theme");
                        } else {
                            document.body.classList.remove("light-theme");
                        }
                    }}
                    aria-label="Toggle Theme"
                >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button className={styles.iconButton}>
                    <Bell size={20} />
                    <span className={styles.notificationBadge}></span>
                </button>

                {user ? (
                    <Link to="/profile" className={styles.profileMenu}>
                        <div className={styles.avatar}>
                            {user.user ? user.user.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className={styles.userName}>{user.user}</span>
                    </Link>
                ) : (
                    <Link to="/Auth" className={styles.profileMenu}>
                        <div className={styles.avatar}><User size={18} /></div>
                        <span className={styles.userName}>Login</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Topbar;
