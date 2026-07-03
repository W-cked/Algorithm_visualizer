import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState({ user: "Guest" });
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            setUser(JSON.parse(stored));
            // Just mocking progress for UI purposes right now
            setProgress(3); 
        }
    }, []);

    const cards = [
        { title: "Sorting Algorithms", count: 5, to: "/sorting/bubble", color: "--accent-purple", icon: "📶" },
        { title: "Searching Algorithms", count: 2, to: "/searching/binary", color: "--accent-cyan", icon: "🔍" },
        { title: "Graph Traversal", count: 3, to: "/graph/binaryTree", color: "--accent-green", icon: "🕸️" },
        { title: "Greedy Algorithms", count: 2, to: "/greedy/dijkstra", color: "--accent-orange", icon: "⚡" },
        { title: "Data Structures", count: 4, to: "/array", color: "--accent-pink", icon: "📦" }
    ];

    return (
        <div style={{ animation: "fadeInUp 0.5s ease both" }}>
            {/* Welcome Banner */}
            <div style={{
                background: "linear-gradient(135deg, rgba(123, 47, 247, 0.15), rgba(0, 212, 255, 0.1))",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-2xl)",
                marginBottom: "var(--space-xl)",
                backdropFilter: "blur(20px)"
            }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "10px" }}>
                    Welcome back, <span style={{ color: "var(--accent-cyan)" }}>{user.user}</span>!
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px" }}>
                    Ready to continue your algorithm journey? You have completed {progress} visualizations so far. Dive back in to master your data structures.
                </p>
                <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
                    <Link to="/sorting/bubble" style={{
                        padding: "10px 20px", background: "var(--accent-cyan)", color: "#000",
                        textDecoration: "none", borderRadius: "var(--radius-md)", fontWeight: 600,
                        boxShadow: "0 0 16px rgba(0,212,255,0.4)"
                    }}>
                        Resume Learning
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-lg)", marginBottom: "var(--space-xl)" }}>
                {cards.map((card, i) => (
                    <Link key={i} to={card.to} style={{
                        background: "var(--surface-glass)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        padding: "var(--space-lg)",
                        textDecoration: "none",
                        transition: "all var(--transition-fast)",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = `var(${card.color})`;
                        e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 12px var(${card.color})`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    >
                        <div style={{
                            width: "48px", height: "48px", borderRadius: "var(--radius-md)",
                            background: `rgba(255,255,255,0.05)`, display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: "1.5rem"
                        }}>
                            {card.icon}
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1rem" }}>{card.title}</h3>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{card.count} visualizers</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Mock */}
            <div>
                <h2 style={{ fontFamily: "var(--font-display)", marginBottom: "16px" }}>Recent Activity</h2>
                <div style={{
                    background: "var(--surface-glass)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-xl)"
                }}>
                    <p style={{ color: "var(--text-muted)", margin: 0 }}>No recent activity to display yet. Complete an algorithm to see it here!</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
