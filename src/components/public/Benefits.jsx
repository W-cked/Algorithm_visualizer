import React from "react";
import { Link } from "react-router-dom";

const Benefits = () => {
    return (
        <div style={{ maxWidth: "1000px", margin: "60px auto", padding: "0 20px", animation: "fadeInUp 0.6s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "20px", background: "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Why Create an Account?
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto" }}>
                    AlgoVisualizer is completely free to use. However, registering unlocks powerful dashboard features to track your learning journey.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "60px" }}>
                <div style={{ background: "var(--surface-glass)", padding: "30px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "20px" }}>📈</div>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "10px" }}>Track Your Progress</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Automatically save which algorithms you have successfully visualized and mastered. Watch your completion percentage grow as you learn.</p>
                </div>
                <div style={{ background: "var(--surface-glass)", padding: "30px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "20px" }}>🎛️</div>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "10px" }}>Personalized Dashboard</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Gain access to a private dashboard layout (Sidebar & Topbar) where you can quickly jump into your recently viewed algorithms.</p>
                </div>
                <div style={{ background: "var(--surface-glass)", padding: "30px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "20px" }}>🏆</div>
                    <h3 style={{ color: "var(--text-primary)", marginBottom: "10px" }}>Achievements</h3>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>Unlock special badges for completing categories like "Sorting Master" or "Graph Explorer" (Coming Soon).</p>
                </div>
            </div>

            <div style={{ textAlign: "center" }}>
                <Link to="/Auth" style={{ display: "inline-block", padding: "16px 32px", background: "linear-gradient(135deg, var(--accent-green), var(--accent-cyan))", color: "#000", textDecoration: "none", borderRadius: "var(--radius-full)", fontWeight: 600, fontSize: "1.1rem", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
                    Create Your Free Account
                </Link>
            </div>
        </div>
    );
};

export default Benefits;
