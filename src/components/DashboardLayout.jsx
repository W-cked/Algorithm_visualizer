import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../index.css"; 

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const location = useLocation();

    // Handle resize events to auto-collapse on mobile and expand on desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebarOnMobile = () => {
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="app-container" style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden", background: "var(--bg-deepest)" }}>
            <Sidebar isOpen={isSidebarOpen} closeSidebarOnMobile={closeSidebarOnMobile} />
            <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                <Topbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className="page-content responsive-canvas-container" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px", scrollBehavior: "smooth" }}>
                    <div style={{ maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
