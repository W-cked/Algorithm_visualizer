import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../../css/Queue.module.css";
import "../../css/bubbleSort.css";
import SectionNav from "../sectionNav";

const Queue = () => {
    const [queue, setQueue] = useState([10, 20, 30, 40, 50]);
    const [inputValue, setInputValue] = useState("");
    const [snackbarMessages, setSnackbarMessages] = useState([]);

    const enqueue = async () => {
        if (inputValue !== "") {
            setQueue((prevQueue) => [...prevQueue, inputValue]);
            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                    withCredentials: true,
                };
                const { data } = await axios.post(
                    import.meta.env.VITE_topic,
                    {
                        userID: userInfo.userID,
                        topic: "Queue",
                        completed: true,
                    },
                    config
                );

                console.log("Submitted:", {
                    data,
                });
            }
            setInputValue("");
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${inputValue} enqueued!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    const dequeue = () => {
        if (queue.length > 0) {
            const dequeuedElement = queue.shift();
            setQueue([...queue]);
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${dequeuedElement} dequeued!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    return (
        <>
            <SectionNav />
            <div className="pdp-container">
                {/* ═══════════════════════════════════════════
                    LEFT COLUMN: PRODUCT SHOWCASE STAGE
                    ═══════════════════════════════════════════ */}
                <div className="pdp-showcase">
                    <div className="showcase-stage">
                        <div className={styles.queuebox} style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            <AnimatePresence>
                                {queue.map((element, index) => (
                                    <motion.div 
                                        // Use element + index as key just for animation sake, 
                                        // or a stable ID. In queue, value might duplicate.
                                        key={`${index}-${element}`} 
                                        layout
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className={styles.queueelement}
                                    >
                                        {element}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════
                    RIGHT COLUMN: CONFIGURATION PANEL
                    ═══════════════════════════════════════════ */}
                <div className="pdp-config">
                    <div className="config-header">
                        <div className="config-category">Linear Data Structure</div>
                        <h1 className="config-title">Queue</h1>
                        <div className="config-rating">
                            ★★★★★ <span style={{ color: "var(--text-muted)" }}>(314 reviews)</span>
                        </div>
                        <div className="config-price">
                            Free <span>₹4.99</span>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Configuration</h3>
                        <div className="config-controls" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter value"
                                    style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--surface-color)", color: "var(--text-primary)" }}
                                />
                                <button className="btn-primary" onClick={enqueue} style={{ width: 'auto' }}>Enqueue</button>
                            </div>
                            <button className="btn-secondary" onClick={dequeue}>Dequeue</button>
                        </div>
                    </div>

                    <div className="config-section">
                        <h3>Product Details</h3>
                        <p className="config-theory">
                            A Queue is a linear data structure that follows the First In, First Out (FIFO) principle. Elements are added (enqueued) at the rear and removed (dequeued) from the front, similar to a physical line of people. It is widely used in scheduling algorithms, breadth-first search, and handling asynchronous requests.
                        </p>
                    </div>

                    <div className="config-section">
                        <h3>Live Diagnostic Log</h3>
                        <div className="log-box">
                            <AnimatePresence mode="popLayout">
                                {snackbarMessages.length > 0 ? (
                                    snackbarMessages.map((msg, idx) => (
                                        <motion.div 
                                            key={`${msg}-${idx}`}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {msg}
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div 
                                        key="ready"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Ready to configure.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Queue;
