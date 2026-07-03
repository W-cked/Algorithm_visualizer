import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import "../index.css";

const PublicLayout = () => {
    return (
        <div className="public-container" style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
