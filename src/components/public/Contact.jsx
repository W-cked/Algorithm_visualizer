import React from "react";

const Contact = () => {
    return (
        <div style={{ maxWidth: "600px", margin: "60px auto", padding: "0 20px", animation: "fadeInUp 0.6s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", marginBottom: "10px", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Contact Us
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Have a question or found a bug? Let us know.</p>
            </div>

            <div style={{ background: "var(--surface-glass)", padding: "40px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)", fontWeight: 500 }}>Name</label>
                        <input type="text" placeholder="John Doe" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)", fontWeight: 500 }}>Email</label>
                        <input type="email" placeholder="john@example.com" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "var(--text-primary)", fontWeight: 500 }}>Message</label>
                        <textarea rows="5" placeholder="How can we help?" style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "var(--font-body)" }}></textarea>
                    </div>
                    <button type="submit" style={{ padding: "14px", background: "linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))", color: "#fff", border: "none", borderRadius: "var(--radius-md)", fontWeight: 600, fontSize: "1rem", cursor: "pointer", marginTop: "10px", boxShadow: "0 4px 16px rgba(0,212,255,0.3)" }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
