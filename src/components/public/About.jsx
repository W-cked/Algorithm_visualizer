import React from "react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px", animation: "fadeInUp 0.6s ease" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "20px", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                About AlgoVisualizer
            </h1>
            <div style={{ background: "var(--surface-glass)", padding: "40px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "20px" }}>
                    AlgoVisualizer was built with a simple mission: to make complex data structures and algorithms understandable, interactive, and beautifully visual.
                </p>
                <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "20px" }}>
                    Whether you are a computer science student studying for exams, a bootcamp graduate preparing for technical interviews, or a seasoned developer looking to brush up on fundamentals, AlgoVisualizer provides real-time, step-by-step animations of how code executes under the hood.
                </p>
                <h3 style={{ marginTop: "40px", color: "var(--text-primary)" }}>Our Technology Stack</h3>
                <ul style={{ color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: "20px" }}>
                    <li><strong>Frontend:</strong> React.js, Custom CSS Modules, Glassmorphism UI</li>
                    <li><strong>Animations:</strong> Pure CSS Keyframes & React State Management</li>
                    <li><strong>Backend (Auth/Progress):</strong> Node.js, Express, MongoDB</li>
                </ul>
                <div style={{ marginTop: "40px" }}>
                    <Link to="/contact" style={{ color: "var(--accent-cyan)", textDecoration: "none", fontWeight: 600 }}>Get in touch with us →</Link>
                </div>
            </div>
        </div>
    );
};

export default About;
