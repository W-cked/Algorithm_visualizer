import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, BarChart3, Search, Network, Zap, Database } from "lucide-react";
import styles from "../css/Sidebar.module.css";

const Sidebar = ({ isOpen, closeSidebarOnMobile }) => {
    // On mobile, clicking a link should close the drawer.
    const handleClick = () => {
        if (window.innerWidth <= 768 && closeSidebarOnMobile) {
            closeSidebarOnMobile();
        }
    };

    return (
        <>
            {/* Mobile overlay backdrop */}
            {isOpen && (
                <div 
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
                        zIndex: 99, display: window.innerWidth <= 768 ? "block" : "none"
                    }}
                    onClick={handleClick}
                />
            )}
            
            <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ""} ${isOpen ? styles.mobileOpen : ""}`}>
                <NavLink to="/" className={styles.logo} onClick={handleClick}>
                    AlgoViz
                </NavLink>

                <div className={styles.navGroup}>
                    <div className={styles.navLabel}>Main</div>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/dashboard"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Dashboard"
                            >
                                <span className={styles.navIcon}><LayoutDashboard size={18} /></span>
                                <span className={styles.navText}>Dashboard</span>
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/profile"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Profile"
                            >
                                <span className={styles.navIcon}><User size={18} /></span>
                                <span className={styles.navText}>Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className={styles.navGroup}>
                    <div className={styles.navLabel}>Categories</div>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/sorting/bubble"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Sorting"
                            >
                                <span className={styles.navIcon}><BarChart3 size={18} /></span>
                                <span className={styles.navText}>Sorting</span>
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/searching/binary"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Searching"
                            >
                                <span className={styles.navIcon}><Search size={18} /></span>
                                <span className={styles.navText}>Searching</span>
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/graph/binaryTree"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Graph Traversal"
                            >
                                <span className={styles.navIcon}><Network size={18} /></span>
                                <span className={styles.navText}>Graph Traversal</span>
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/greedy/dijkstra"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Greedy Algos"
                            >
                                <span className={styles.navIcon}><Zap size={18} /></span>
                                <span className={styles.navText}>Greedy Algos</span>
                            </NavLink>
                        </li>
                        <li className={styles.navItem}>
                            <NavLink
                                to="/array"
                                onClick={handleClick}
                                className={({ isActive }) =>
                                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                                }
                                title="Data Structures"
                            >
                                <span className={styles.navIcon}><Database size={18} /></span>
                                <span className={styles.navText}>Data Structures</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
